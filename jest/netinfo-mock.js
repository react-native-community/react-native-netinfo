/**
 * @format
 */
/* eslint-env jest */

const defaultState = {
  type: 'cellular',
  isConnected: true,
  isInternetReachable: true,
  details: {
    isConnectionExpensive: true,
    cellularGeneration: '3g',
  },
};

const RNCNetInfoMock = {
  configure: jest.fn(),
  fetch: jest.fn(),
  addEventListener: jest.fn(),
  useNetInfo: jest.fn(),
};

RNCNetInfoMock.fetch.mockResolvedValue(defaultState);
RNCNetInfoMock.useNetInfo.mockReturnValue(defaultState);

module.exports = RNCNetInfoMock;
