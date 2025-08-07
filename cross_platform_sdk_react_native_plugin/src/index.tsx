// cross_platform/src/index.tsx

import { NativeModules } from 'react-native';

// Make the function async
export const getInstalledUpiApps = async () => {
  if (
    !NativeModules.CrossPlatform ||
    typeof NativeModules.CrossPlatform.getInstalledApps !== 'function'
  ) {
    throw new Error('CrossPlatform module not available');
  }

  try {
    // Await the promise to get the actual result
    const result = await NativeModules.CrossPlatform.getInstalledApps();

    // Now 'result' is the array you expect
    return result; // Return the actual list of apps
  } catch (error) {
    // Re-throw the error so the calling code knows something went wrong
    if (error instanceof Error) {
      console.log('Full error stack trace:', error.stack);
      throw new Error(
        `Failed during the native call to get installed apps : ${error.message}`
      );
    } else {
      console.log('Unknown error:', error);
      throw new Error(
        `Failed during the native call to get installed apps : ${String(error)}`
      );
    }
  }
};
