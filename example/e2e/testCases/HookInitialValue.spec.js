/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
/* global device, element, by */

describe('HookInitialValue', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
    await device.openURL({url: 'netinfoexample://hookInitialValue'});
  });

  it('should have the correct elements to perform the test', async () => {
    await expect(element(by.id('results'))).toExist();
  });

  it('should show a pass', async () => {
    await expect(element(by.id('result'))).toHaveLabel('pass');
  });
});
