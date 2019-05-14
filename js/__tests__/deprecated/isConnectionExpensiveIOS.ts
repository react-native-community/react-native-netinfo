/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

jest.mock('Platform', () => {
  const Platform = jest.requireActual('Platform');
  Platform.OS = 'ios';
  return Platform;
});

import NetInfo from '../../index';
import NativeInterface from '../../internal/nativeInterface';

const MockNativeInterface: jest.Mocked<typeof NativeInterface> = NativeInterface as any;

describe('Deprecated', () => {
  describe('isConnectionExpensive', () => {
    describe('iOS', () => {
      it('should reject with an error when called', () => {
        MockNativeInterface.getCurrentState.mockResolvedValue({
          type: "wifi",
          isConnected: true,
          details: {
            isConnectionExpensive: false
          },
        });
        return expect(NetInfo.isConnectionExpensive()).rejects.toThrowError();
      });
    });
  });
});
