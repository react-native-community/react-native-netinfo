/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {NativeEventSubscription} from 'react-native';
import NativeInterface from './nativeInterface';
import InternetReachability from './internetReachability';
import * as Types from './types';
import * as PrivateTypes from './privateTypes';

export default class State {
  private _nativeEventSubscription: NativeEventSubscription | null = null;
  private _subscriptions = new Set<Types.NetInfoChangeHandler>();
  private _latestState: Types.NetInfoState | null = null;
  private _internetReachability: InternetReachability;

  constructor(configuration: Types.NetInfoConfiguration) {
    // Add the listener to the internet connectivity events
    this._internetReachability = new InternetReachability(
      configuration,
      this._handleInternetReachabilityUpdate,
    );

    // Add the subscription to the native events
    this._nativeEventSubscription = NativeInterface.eventEmitter.addListener(
      PrivateTypes.DEVICE_CONNECTIVITY_EVENT,
      this._handleNativeStateUpdate,
    );

    // Fetch the current state from the native module
    this._fetchCurrentState();
  }

  private _handleNativeStateUpdate = (
    state: PrivateTypes.NetInfoNativeModuleState,
  ): void => {
    // Update the internet reachability module
    this._internetReachability.update(state);

    // Convert the state from native to JS shape
    const convertedState = this._convertState(state);

    // Update the listeners
    this._latestState = convertedState;
    this._subscriptions.forEach((handler): void => handler(convertedState));
  };

  private _handleInternetReachabilityUpdate = (
    isInternetReachable: boolean | null | undefined,
  ): void => {
    if (!this._latestState) {
      return;
    }

    const nextState = {
      ...this._latestState,
      isInternetReachable,
    } as Types.NetInfoState;
    this._latestState = nextState;
    this._subscriptions.forEach((handler): void => handler(nextState));
  };

  private _fetchCurrentState = async (
    requestedInterface?: string,
  ): Promise<Types.NetInfoState> => {
    const state = await NativeInterface.getCurrentState(requestedInterface);

    // Update the internet reachability module
    this._internetReachability.update(state);
    // Convert and store the new state
    const convertedState = this._convertState(state);
    if (!requestedInterface) {
      this._latestState = convertedState;
    }

    return convertedState;
  };

  private _convertState = (
    input: PrivateTypes.NetInfoNativeModuleState,
  ): Types.NetInfoState => {
    if (typeof input.isInternetReachable === 'boolean') {
      return input as Types.NetInfoState;
    } else {
      return {
        ...input,
        isInternetReachable: this._internetReachability.currentState(),
      } as Types.NetInfoState;
    }
  };

  public reportConnected(): void {
    this._internetReachability.reportConnected();
  }

  public latest = (
    requestedInterface?: string,
  ): Promise<Types.NetInfoState> => {
    if (requestedInterface) {
      return this._fetchCurrentState(requestedInterface);
    } else if (this._latestState) {
      return Promise.resolve(this._latestState);
    } else {
      return this._fetchCurrentState();
    }
  };

  public add = (handler: Types.NetInfoChangeHandler): void => {
    // Add the subscription handler to our set
    this._subscriptions.add(handler);

    // Send it the latest data we have
    if (this._latestState) {
      handler(this._latestState);
    } else {
      this.latest().then(handler);
    }
  };

  public remove = (handler: Types.NetInfoChangeHandler): void => {
    this._subscriptions.delete(handler);
  };

  public tearDown = (): void => {
    if (this._internetReachability) {
      this._internetReachability.tearDown();
    }

    if (this._nativeEventSubscription) {
      this._nativeEventSubscription.remove();
    }

    this._subscriptions.clear();
  };
}
