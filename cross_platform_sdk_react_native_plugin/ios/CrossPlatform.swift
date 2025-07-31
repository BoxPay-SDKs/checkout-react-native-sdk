import Foundation
import CrossPlatformSDK
import React // Make sure to import React

// The @objc(CrossPlatform) is what exposes this to React Native.
@objc(CrossPlatform)
class CrossPlatform: NSObject {

  // This is the correct initializer that the React Native bridge will call.
  @objc
  override init() {
    super.init()
  }

  // This tells React Native the name to use for the module in JavaScript.
  // It must return true for classic modules.
  @objc
  static func moduleName() -> String! {
    return "CrossPlatform"
  }

  // This exposes your getInstalledApps function to JavaScript.
  @objc
  func getInstalledApps(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    // For now, let's return dummy data to confirm the bridge is working.
    let detector = UPIAppDetectorIOS()
    let upiService = UPIService(detector: detector)
    let apps = upiService.getAvailableApps()
    resolve(apps)
  }

  // This tells React Native whether to set up the module on the main UI thread.
  // False is better for performance for non-UI modules.
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}