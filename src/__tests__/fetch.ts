/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import NetInfo from '../index';
import {NativeModules} from 'react-native';
import NativeInterface from '../internal/nativeInterface';
import {NetInfoStateType, NetInfoCellularGeneration} from '../internal/types';

const DEVICE_CONNECTIVITY_EVENT = 'netInfo.networkStatusDidChange';

describe('@react-native-community/netinfo fetch', () => {
  describe('with cellular data types', () => {
    describe('4g cellular generation', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.cellular,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: NetInfoCellularGeneration['4g'],
          },
        });
      });
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected 4g settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 4g returns not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when 4g returns internet not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['4g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('3g cellular generation', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.cellular,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: NetInfoCellularGeneration['3g'],
          },
        });
      });
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['3g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('2g cellular generation', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.cellular,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: NetInfoCellularGeneration['2g'],
          },
        });
      });
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: NetInfoCellularGeneration['2g'],
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });

    describe('null cellular generation', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
          type: NetInfoStateType.cellular,
          isConnected: true,
          isInternetReachable: true,
          details: {
            isConnectionExpensive: true,
            cellularGeneration: null,
          },
        });
      });
      function dataProvider() {
        return [
          {
            description:
              'should resolve the promise correctly with expected settings',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when not connected',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: false,
              isInternetReachable: true,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
          {
            description:
              'should resolve the promise correctly when internet is not reachable',
            expectedConnectionInfo: {
              type: NetInfoStateType.cellular,
              isConnected: true,
              isInternetReachable: false,
              details: {
                isConnectionExpensive: true,
                cellularGeneration: null,
              },
            },
          },
        ];
      }

      dataProvider().forEach(testCase => {
        it(testCase.description, () => {
          NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue(
            testCase.expectedConnectionInfo,
          );

          NativeInterface.eventEmitter.emit(
            DEVICE_CONNECTIVITY_EVENT,
            testCase.expectedConnectionInfo,
          );
          expect(NetInfo.fetch()).resolves.toEqual(
            testCase.expectedConnectionInfo,
          );
        });
      });
    });
  });

  describe('with unknown and no connection data types', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['4g'],
        },
      });
    });
    function dataProvider() {
      return [
        {
          description:
            'should resolve the promise correctly when no connection is established (airplane mode)',
          expectedConnectionInfo: {
            type: NetInfoStateType.none,
            isConnected: false,
            isInternetReachable: true,
            details: null,
          },
        },
        {
          description:
            'should resolve the promise correctly when connection type cannot be determined',
          expectedConnectionInfo: {
            type: NetInfoStateType.unknown,
            isConnected: false,
            isInternetReachable: true,
            details: null,
          },
        },
      ];
    }

    dataProvider().forEach(testCase => {
      it(testCase.description, () => {
        NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue(
          testCase.expectedConnectionInfo,
        );

        NativeInterface.eventEmitter.emit(
          DEVICE_CONNECTIVITY_EVENT,
          testCase.expectedConnectionInfo,
        );
        expect(NetInfo.fetch()).resolves.toEqual(
          testCase.expectedConnectionInfo,
        );
      });
    });
  });

  describe('rejected promises are handled', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      NativeModules.RNCNetInfo.getCurrentState.mockResolvedValue({
        type: NetInfoStateType.cellular,
        isConnected: true,
        isInternetReachable: true,
        details: {
          isConnectionExpensive: true,
          cellularGeneration: NetInfoCellularGeneration['4g'],
        },
      });
    });

    it('will properly reject a promise if the connection request cannot be resolved', () => {
      NativeModules.RNCNetInfo.getCurrentState.mockRejectedValue(
        'nope, no connection info for you',
      );

      NativeInterface.eventEmitter.emit(
        DEVICE_CONNECTIVITY_EVENT,
        'nope, no connection info for you',
      );

      expect(NetInfo.fetch()).rejects;
    });
  });
});
