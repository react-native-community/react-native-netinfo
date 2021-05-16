
# `@react-native-community/netinfo`

[![CircleCI Status](https://img.shields.io/circleci/project/github/react-native-netinfo/react-native-netinfo/master.svg)](https://circleci.com/gh/react-native-netinfo/workflows/react-native-netinfo/tree/master) ![Supports Android, iOS, macOS, and Windows](https://img.shields.io/badge/platforms-android%20|%20ios%20|%20macos%20|%20windows-lightgrey.svg) ![MIT License](https://img.shields.io/npm/l/@react-native-community/netinfo.svg) [![Lean Core Extracted](https://img.shields.io/badge/Lean%20Core-Extracted-brightgreen.svg)](https://github.com/facebook/react-native/issues/23313)

React Native Network Info API for Android, iOS, macOS & Windows. It allows you to get information on:

* Connection type
* Connection quality

## Getting started
Install the library using either Yarn:

```
yarn add @react-native-community/netinfo
```

or npm:

```
npm install --save @react-native-community/netinfo
```

#### Using React Native >= 0.60
Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

- **iOS Platform:**

  `$ npx pod-install` # CocoaPods on iOS needs this extra step

- **Android Platform with AndroidX:**

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "28.0.3"
      minSdkVersion = 16
      compileSdkVersion = 28
      targetSdkVersion = 28
      androidXCore = "1.3.2" // Check versions here: https://developer.android.com/jetpack/androidx/releases/core
      // Put here other AndroidX dependencies
    }
  ```

- **macOS Platform:**

  Autolinking is not yet available on macOS.  See the [Manual linking steps for macOS](#manual-linking-macos) below.

<details id='manual-linking-macos'>
<summary>Manually link the library on macOS</summary>

1. Open your project `.xcodeproj` on xcode.

2. Right click on the Libraries folder and select `Add files to "yourProjectName"`.

3. Add `RNCNetInfo.xcodeproj` (located at `node_modules/@react-native-community/react-native-netinfo/macos`) to your project Libraries.

4. Go to `Build Phases -> Link Binary with Libraries` and add: `libRNCNetInfo-macOS.a`.

</details>

- **Windows Platform:**

  Autolinking status is unknown on Windows. If you need to manually link, see the [Manual linking steps for Windows](#manual-linking-windows) below.

<details id='manual-linking-windows'>
<summary>Manually link the library on Windows</summary>

#### Link C++ implementation
* Open the solution in Visual Studio for your Windows apps
* Right click in the Explorer and click Add > Existing Project...
* Navigate to `./<app-name>/node_modules/@react-native-community/netinfo/windows/RNCNetInfoCPP/` and add `RNCNetInfoCPP.vcxproj`
* This time right click on your React Native Windows app under your solutions directory and click Add > Reference...
* Check the `RNCNetInfoCPP` you just added and press ok
* Open `pch.h`, add `#include "winrt/ReactNativeNetInfo.h"`
* Open `App.cpp`, add `PackageProviders().Append(winrt::ReactNativeNetInfo::ReactPackageProvider());` before `InitializeComponent();`

#### Link C# implementation
* Open the solution in Visual Studio for your Windows apps
* Right click in the Explorer and click Add > Existing Project...
* Navigate to `./<app-name>/node_modules/@react-native-community/netinfo/windows/RNCNetInfo/` and add `RNCNetInfo.csproj`
* This time right click on your React Native Windows app under your solutions directory and click Add > Reference...
* Check the `RNCNetInfo` you just added and press ok
* Open up `MainReactNativeHost.cs` for your app and edit the file like so:

```diff
+ using ReactNativeCommunity.NetInfo;
......
        protected override List<IReactPackage> Packages => new List<IReactPackage>
        {
            new MainReactPackage(),
+           new RNCNetInfoPackage(),
        };
```

</details>

## React Native Compatibility
To use this library you need to ensure you are using the correct version of React Native. If you are using a version of React Native that is lower than `0.57` you will need to upgrade that before attempting to use this library.

| `@react-native-community/netinfo` version | Required React Native Version                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------------- |
| `4.x.x` & `5.x.x`                         | `>= 0.60` or `>= 0.59` if using [Jetifier](https://github.com/mikehardy/jetifier) |
| `3.x.x`                                   | `>= 0.59`                                                                         |
| `2.x.x`                                   | `>= 0.57`                                                                         |
| `1.x.x`                                   | `>= 0.57`                                                                         |

## Browser Compatilibity
The web implementation heavily depends on the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) which is still an is an experimental technology and thus it's not supported in every browser.
If this API is not available the library will safely fallback to the old [onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine) property and return basic connection information.

## Migrating from the core `react-native` module
This module was created when the NetInfo was split out from the core of React Native. To migrate to this module you need to follow the installation instructions above and then change you imports from:

```javascript
import { NetInfo } from "react-native";
```

to:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Note that the API was updated after it was extracted from NetInfo to support some new features, however, the previous API is still available and works with no updates to your code.

## Usage
Import the library:

```javascript
import NetInfo from "@react-native-community/netinfo";
```

Subscribe to network state updates:

```javascript
// Subscribe
const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
```

Get the network state once:

```javascript
NetInfo.fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

## API
* **Types:**
  * [`NetInfoState`](#netinfostate)
  * [`NetInfoStateType`](#netinfostatetype)
  * [`NetInfoCellularGeneration`](#netinfocellulargeneration)
* **Methods:**
  * [`fetch()`](#fetch)
  * [`addEventListener()`](#addeventlistener)
  * [`useNetInfo()`](#usenetinfo)

### Types

#### `NetInfoState`
Describes the current state of the network. It is an object with these properties:

| Property              | Type                                    | Description                                                                                        |
| --------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `type`                | [`NetInfoStateType`](#netinfostatetype) | The type of the current connection.                                                                |
| `isConnected`         | `boolean`, `null`                               | If there is an active network connection. If unknown defaults to `null`. |
| `isInternetReachable` | `boolean`, `null`                             | If the internet is reachable with the currently active network connection. If unknown defaults to `null`                         |
| `isWifiEnabled`       | `boolean`                               | *(Android only)* Whether the device's WiFi is ON or OFF.                                           |
| `details`             |                                         | The value depends on the `type` value. See below.                                                  |

The `details` value depends on the `type` value.

##### `type` is `none` or `unknown`

`details` is `null`.

##### `type` is `wifi`

`details` has these properties:

| Property                | Platform                          | Type      | Description                                                                                                                |
| ----------------------- | --------------------------------- | --------- | -------------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, macOS, Windows, Web | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms.                     |
| `ssid`                  | Android, iOS (not tvOS)           | `string`  | The SSID of the network. May not be present, `null`, or an empty string if it cannot be determined. **On iOS, make sure your app meets at least one of the [following requirements](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion). On Android, you need to have the `ACCESS_FINE_LOCATION` permission in your `AndroidManifest.xml` and accepted by the user**. |
| `bssid`                 | Android, iOS (not tvOS)           | `string`  | The BSSID of the network. May not be present, `null`, or an empty string if it cannot be determined. **On iOS, make sure your app meets at least one of the [following requirements](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo?language=objc#discussion). On Android, you need to have the `ACCESS_FINE_LOCATION` permission in your `AndroidManifest.xml` and accepted by the user**. |
| `strength`              | Android                           | `number`  | An integer number from `0` to `100` for the signal strength. May not be present if the signal strength cannot be determined. |
| `ipAddress`             | Android, iOS, macOS               | `string`  | The external IP address. Can be in IPv4 or IPv6 format. May not be present if it cannot be determined.                     |
| `subnet`                | Android, iOS, macOS               | `string`  | The subnet mask in IPv4 format. May not be present if it cannot be determined.                                             |
| `frequency`             | Android                           | `number`  | Network frequency. Example: For 2.4 GHz networks, the method will return 2457. May not be present if it cannot be determined.                                             |

##### `type` is `cellular`

`details` has these properties:

| Property                | Platform                          | Type                                                               | Description                                                                                                           |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `isConnectionExpensive` | Android, iOS, macOS, Windows, Web | `boolean`                                                          | If the network connection is considered "expensive". This could be in either energy or monetary terms.                |
| `cellularGeneration`    | Android, iOS, Windows             | [`NetInfoCellularGeneration`](#netinfocellulargeneration)          | The generation of the cell network the user is connected to. This can give an indication of speed, but no guarantees. |
| `carrier`               | Android, iOS                      | `string`                                                           | The network carrier name. May not be present or may be empty if none can be determined.                               |

##### `type` is `bluetooth`, `ethernet`, `wimax`, `vpn`, or `other`

`details` has these properties:

| Property                | Type      | Description                                                                                            |
| ----------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `isConnectionExpensive` | `boolean` | If the network connection is considered "expensive". This could be in either energy or monetary terms. |

#### `NetInfoStateType`
Describes the current type of network connection. It is an enum with these possible values:

| Value       | Platform                          | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `none`      | Android, iOS, macOS, Windows, Web | No network connection is active                            |
| `unknown`   | Android, iOS, macOS, Windows, Web | The network state could not or has yet to be be determined |
| `cellular`  | Android, iOS, Windows, Web        | Active network over cellular                               |
| `wifi`      | Android, iOS, macOS, Windows, Web | Active network over Wifi                                   |
| `bluetooth` | Android, Web                      | Active network over Bluetooth                              |
| `ethernet`  | Android, macOS, Windows, Web      | Active network over wired ethernet                         |
| `wimax`     | Android, Web                      | Active network over WiMax                                  |
| `vpn`       | Android                           | Active network over VPN                                    |
| `other`     | Android, iOS, macOS, Windows, Web | Active network over another type of network                |

#### `NetInfoCellularGeneration`
Describes the current generation of the `cellular` connection. It is an enum with these possible values:

| Value     | Description                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------------------- |
| `null`    | Either we are not currently connected to a cellular network or type could not be determined                       |
| `2g`      | Currently connected to a 2G cellular network. Includes CDMA, EDGE, GPRS, and IDEN type connections                |
| `3g`      | Currently connected to a 3G cellular network. Includes EHRPD, EVDO, HSPA, HSUPA, HSDPA, and UTMS type connections |
| `4g`      | Currently connected to a 4G cellular network. Includes HSPAP and LTE type connections                             |

#### `NetInfoConfiguration`
The configuration options for the library.

| Property                     | Type                              | Description                                                                                                                                                                                                                               |
| ---------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reachabilityUrl`            | `string`                          | The URL to call to test if the internet is reachable. Only used on platforms which do not supply internet reachability natively.                                                                                                          |
| `reachabilityTest`           | `(response: Response) => boolean` | A function which is passed the `Response` from calling the reachability URL. It should return `true` if the response indicates that the internet is reachable. Only used on platforms which do not supply internet reachability natively. |
| `reachabilityShortTimeout`   | `number`                          | The number of milliseconds between internet reachability checks when the internet was not previously detected. Only used on platforms which do not supply internet reachability natively.                                                 |
| `reachabilityLongTimeout`    | `number`                          | The number of milliseconds between internet reachability checks when the internet was previously detected. Only used on platforms which do not supply internet reachability natively.                                                     |
| `reachabilityRequestTimeout` | `number`                          | The number of milliseconds that a reachability check is allowed to take before failing. Only used on platforms which do not supply internet reachability natively.                                                                        |

### Methods

#### `configure()`

Configures the library with the given configuration. You only need to supply the properties which you want to change from the default values.

Note that calling this will stop all previously added listeners from being called again. It is best to call this right when your application is started to avoid issues.

**Example:**
```javascript
NetInfo.configure({
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (response) => response.status === 204,
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
});
```

#### `addEventListener()`

Subscribe to connection information. The callback is called with a parameter of type [`NetInfoState`](README.md#netinfostate) whenever the connection state changes. Your listener will be called with the latest information soon after you subscribe and then with any subsequent changes afterwards. You should not assume that the listener is called in the same way across devices or platforms.

| Parameter   | Type                                                          | Description                                                             |
| ----------- | ------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `listener`  | `(state: `[`NetInfoState`](README.md#netinfostate))` => void` | The listener which will be called whenever the connection state changes |

**Example:**
```javascript
// Subscribe
const unsubscribe = NetInfo.addEventListener(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
```

#### `useNetInfo()`

A [React Hook](https://reactjs.org/docs/hooks-intro.html) which can be used to get access to the latest state. It returns a hook with the [`NetInfoState`](README.md#netinfostate) type.

**Example:**
```jsx
import {useNetInfo} from "@react-native-community/netinfo";

const YourComponent = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>Type: {netInfo.type}</Text>
      <Text>Is Connected? {netInfo.isConnected.toString()}</Text>
    </View>
  );
};
```

You can optionally send configuration when setting up the hook. Note that configuration is global for the library, so you shouldn't send different configuration for different hooks. It is instead recommended that you called `NetInfo.configure()` once when your project starts. The hook option is only provided as a convinience.

```jsx
const YourComponent = () => {
  const netInfo = useNetInfo({
    reachabilityUrl: 'https://clients3.google.com/generate_204',
    reachabilityTest: async (response) => response.status === 204,
    reachabilityLongTimeout: 60 * 1000, // 60s
    reachabilityShortTimeout: 5 * 1000, // 5s
    reachabilityRequestTimeout: 15 * 1000, // 15s
  });

  // ...
};
```

#### `fetch()`

Returns a `Promise` that resolves to a [`NetInfoState`](README.md#netinfostate) object.

**Example:**
```javascript
NetInfo.fetch().then(state => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});
```

You can optionally send an `interface` string so the `Promise` resolves to a [`NetInfoState`](README.md#netinfostate) from the [`NetInfoStateType`](#netinfostatetype) indicated in `interface` argument.

```javascript
NetInfo.fetch("wifi").then(state => {
  console.log("SSID", state.details.ssid);
  console.log("BSSID", state.details.bssid);
  console.log("Is connected?", state.isConnected);
});
```

## Troubleshooting

### Errors when building on Android

This library was migrated from using the support library to AndroidX in version `4.0.0`. All of your depenencies must be using either the support library *or* AndroidX. Using a mixture of the two is not possible.

From React Native 0.60 AndroidX is used by default.

If you need to either convert this library back to the support library (to use an older React Native version) or convert other libraries forward to use AndroidX (if they have not been updated yet), you can use the [Jetifier](https://github.com/mikehardy/jetifier) tool.

### Errors while running Jest tests

If you do not have a Jest Setup file configured, you should add the following to your Jest settings and create the `jest.setup.js` file in project root:

```js
setupFiles: ['<rootDir>/jest.setup.js']
```

You should then add the following to your Jest setup file to mock the NetInfo Native Module:

```js
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';

jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);
```

### Issues with the iOS simulator

There is a [known](http://openradar.appspot.com/14585459) [issue](http://www.openradar.appspot.com/29913522) with the iOS Simulator which causes it to not receive network change notifications correctly when the host machine disconnects and then connects to Wifi. If you are having issues with iOS then please test on an actual device before reporting any bugs.

## Maintainers

* [Matt Oakes](https://github.com/matt-oakes) - [Freelance React Native Developer](http://mattoakes.net)
* [Mike Diarmid](https://github.com/salakar) - [Invertase](https://invertase.io)

## Contributing

Please see the [contributing guide](/CONTRIBUTING.md).

## License

The library is released under the MIT license. For more information see [`LICENSE`](/LICENSE).
