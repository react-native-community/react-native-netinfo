/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export enum NetInfoStateType {
  unknown = 'unknown',
  none = 'none',
  cellular = 'cellular',
  wifi = 'wifi',
  bluetooth = 'bluetooth',
  ethernet = 'ethernet',
  wimax = 'wimax',
  vpn = 'vpn',
  other = 'other',
}

export enum NetInfoCellularGeneration {
  '2g' = '2g',
  '3g' = '3g',
  '4g' = '4g',
  '5g' = '5g',
}

export interface NetInfoConnectedDetails {
  isConnectionExpensive: boolean;
}

interface NetInfoConnectedState<
  T extends NetInfoStateType,
  D extends object = {}
> {
  type: T;
  isConnected: true;
  isInternetReachable: boolean | null;
  details: D & NetInfoConnectedDetails;
  isWifiEnabled?: boolean;
}

interface NetInfoDisconnectedState<T extends NetInfoStateType> {
  type: T;
  isConnected: false;
  isInternetReachable: false;
  details: null;
}

export interface NetInfoUnknownState {
  type: NetInfoStateType.unknown;
  isConnected: null;
  isInternetReachable: null;
  details: null;
}

export type NetInfoNoConnectionState = NetInfoDisconnectedState<
  NetInfoStateType.none
>;
export type NetInfoDisconnectedStates =
  | NetInfoUnknownState
  | NetInfoNoConnectionState;

export type NetInfoCellularState = NetInfoConnectedState<
  NetInfoStateType.cellular,
  {
    cellularGeneration: NetInfoCellularGeneration | null;
    carrier: string | null;
  }
>;
export type NetInfoWifiState = NetInfoConnectedState<
  NetInfoStateType.wifi,
  {
    ssid: string | null;
    bssid: string | null;
    strength: number | null;
    ipAddress: string | null;
    subnet: string | null;
    frequency: number | null;
  }
>;
export type NetInfoBluetoothState = NetInfoConnectedState<
  NetInfoStateType.bluetooth
>;
export type NetInfoEthernetState = NetInfoConnectedState<
  NetInfoStateType.ethernet,
  {
    ipAddress: string | null;
    subnet: string | null;
  }
>;
export type NetInfoWimaxState = NetInfoConnectedState<NetInfoStateType.wimax>;
export type NetInfoVpnState = NetInfoConnectedState<NetInfoStateType.vpn>;
export type NetInfoOtherState = NetInfoConnectedState<NetInfoStateType.other>;
export type NetInfoConnectedStates =
  | NetInfoCellularState
  | NetInfoWifiState
  | NetInfoBluetoothState
  | NetInfoEthernetState
  | NetInfoWimaxState
  | NetInfoVpnState
  | NetInfoOtherState;

export type NetInfoState = NetInfoDisconnectedStates | NetInfoConnectedStates;

export type NetInfoChangeHandler = (state: NetInfoState) => void;
export type NetInfoSubscription = () => void;

export interface NetInfoConfiguration {
  reachabilityUrl: string;
  reachabilityTest: (response: Response) => Promise<boolean>;
  reachabilityLongTimeout: number;
  reachabilityShortTimeout: number;
  reachabilityRequestTimeout: number;
}
