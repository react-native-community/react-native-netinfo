/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RNCNetInfo.h"

#if !TARGET_OS_TV
  #import <CoreTelephony/CTTelephonyNetworkInfo.h>
#endif
#import <React/RCTAssert.h>
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

// Based on the ConnectionType enum described in the W3C Network Information API spec
// (https://wicg.github.io/netinfo/).
static NSString *const RNCConnectionTypeUnknown = @"unknown";
static NSString *const RNCConnectionTypeNone = @"none";
static NSString *const RNCConnectionTypeWifi = @"wifi";
static NSString *const RNCConnectionTypeCellular = @"cellular";

// Based on the EffectiveConnectionType enum described in the W3C Network Information API spec
// (https://wicg.github.io/netinfo/).
static NSString *const RNCEffectiveConnectionTypeUnknown = @"unknown";
static NSString *const RNCEffectiveConnectionType2g = @"2g";
static NSString *const RNCEffectiveConnectionType3g = @"3g";
static NSString *const RNCEffectiveConnectionType4g = @"4g";

@implementation RNCNetInfo
{
  SCNetworkReachabilityRef _firstTimeReachability;
  SCNetworkReachabilityRef _reachability;
  NSString *_connectionType;
  NSString *_effectiveConnectionType;
  NSString *_host;
  BOOL _isObserving;
  RCTPromiseResolveBlock _resolve;
}

RCT_EXPORT_MODULE()

static void RNCReachabilityCallback(__unused SCNetworkReachabilityRef target, SCNetworkReachabilityFlags flags, void *info)
{
  RNCNetInfo *self = (__bridge id)info;
  BOOL didSetReachabilityFlags = [self setReachabilityStatus:flags];
  
  NSString *connectionType = self->_connectionType ?: RNCConnectionTypeUnknown;
  NSString *effectiveConnectionType = self->_effectiveConnectionType ?: RNCEffectiveConnectionTypeUnknown;

  if (self->_firstTimeReachability && self->_resolve) {
    SCNetworkReachabilityUnscheduleFromRunLoop(self->_firstTimeReachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    CFRelease(self->_firstTimeReachability);
    self->_resolve(@{@"connectionType": connectionType,
                     @"effectiveConnectionType": effectiveConnectionType});
    self->_firstTimeReachability = nil;
    self->_resolve = nil;
  }

  if (didSetReachabilityFlags && self->_isObserving) {
    [self sendEventWithName:@"networkStatusDidChange" body:@{@"connectionType": connectionType,
                                                             @"effectiveConnectionType": effectiveConnectionType}];
  }
}

// We need RNCReachabilityCallback's and module methods to be called on the same thread so that we can have
// guarantees about when we mess with the reachability callbacks.
- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

#pragma mark - Lifecycle

- (instancetype)initWithHost:(NSString *)host
{
  RCTAssertParam(host);
  RCTAssert(![host hasPrefix:@"http"], @"Host value should just contain the domain, not the URL scheme.");

  if ((self = [self init])) {
    _host = [host copy];
  }
  return self;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"networkStatusDidChange"];
}

- (void)startObserving
{
  _isObserving = YES;
  _connectionType = RNCConnectionTypeUnknown;
  _effectiveConnectionType = RNCEffectiveConnectionTypeUnknown;
  _reachability = [self getReachabilityRef];
}

- (void)stopObserving
{
  _isObserving = NO;
  if (_reachability) {
    SCNetworkReachabilityUnscheduleFromRunLoop(_reachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    CFRelease(_reachability);
  }
}

- (void)dealloc
{
  if (_firstTimeReachability) {
    SCNetworkReachabilityUnscheduleFromRunLoop(self->_firstTimeReachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    CFRelease(self->_firstTimeReachability);
    _firstTimeReachability = nil;
    _resolve = nil;
  }
}

- (SCNetworkReachabilityRef)getReachabilityRef
{
  SCNetworkReachabilityRef reachability = SCNetworkReachabilityCreateWithName(kCFAllocatorDefault, _host.UTF8String ?: "apple.com");
  SCNetworkReachabilityContext context = { 0, ( __bridge void *)self, NULL, NULL, NULL };
  SCNetworkReachabilitySetCallback(reachability, RNCReachabilityCallback, &context);
  SCNetworkReachabilityScheduleWithRunLoop(reachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    
  return reachability;
}

- (BOOL)setReachabilityStatus:(SCNetworkReachabilityFlags)flags
{
  NSString *connectionType = RNCConnectionTypeUnknown;
  NSString *effectiveConnectionType = RNCEffectiveConnectionTypeUnknown;
  if ((flags & kSCNetworkReachabilityFlagsReachable) == 0 ||
      (flags & kSCNetworkReachabilityFlagsConnectionRequired) != 0) {
    connectionType = RNCConnectionTypeNone;
  }
  
#if !TARGET_OS_TV
  
  else if ((flags & kSCNetworkReachabilityFlagsIsWWAN) != 0) {
    connectionType = RNCConnectionTypeCellular;
    
    CTTelephonyNetworkInfo *netinfo = [[CTTelephonyNetworkInfo alloc] init];
    if (netinfo) {
      if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyGPRS] ||
          [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyEdge] ||
          [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMA1x]) {
        effectiveConnectionType = RNCEffectiveConnectionType2g;
      } else if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyWCDMA] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSDPA] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyHSUPA] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORev0] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevA] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyCDMAEVDORevB] ||
                 [netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyeHRPD]) {
        effectiveConnectionType = RNCEffectiveConnectionType3g;
      } else if ([netinfo.currentRadioAccessTechnology isEqualToString:CTRadioAccessTechnologyLTE]) {
        effectiveConnectionType = RNCEffectiveConnectionType4g;
      }
    }
  }
  
#endif
  
  else {
    connectionType = RNCConnectionTypeWifi;
  }
  
  if (![connectionType isEqualToString:self->_connectionType] ||
      ![effectiveConnectionType isEqualToString:self->_effectiveConnectionType]) {
    self->_connectionType = connectionType;
    self->_effectiveConnectionType = effectiveConnectionType;
    return YES;
  }
  
  return NO;
}

#pragma mark - Public API

RCT_EXPORT_METHOD(getCurrentConnectivity:(RCTPromiseResolveBlock)resolve
                  reject:(__unused RCTPromiseRejectBlock)reject)
{
  if (_firstTimeReachability) {
    SCNetworkReachabilityUnscheduleFromRunLoop(self->_firstTimeReachability, CFRunLoopGetMain(), kCFRunLoopCommonModes);
    CFRelease(self->_firstTimeReachability);
    _firstTimeReachability = nil;
    _resolve = nil;
  }
  _firstTimeReachability = [self getReachabilityRef];
  _resolve = resolve;
}

@end
