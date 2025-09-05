module.exports = {
    dependency: {
      platforms: {
        android: {
          sourceDir: './android',
          packageImportPath: 'import com.reactnativemodule.ReactNativeModulePackage;', // Corrected import
          packageInstance: 'new ReactNativeModulePackage()', // Corrected instantiation
        },
        ios: {
          sourceDir: './ios',
          podspecPath: './ios/cross_platform_react_native_plugin.podspec', // Updated podspec path
        },
      }
    },
  };