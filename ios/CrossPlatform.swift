import Foundation
import CrossPlatformSDK
import React

@objc(CrossPlatform)
class CrossPlatform: NSObject {

  @objc
  override init() { super.init() }

  @objc
  static func moduleName() -> String! { "CrossPlatform" }

  @objc
  func getInstalledApps(_ resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    let detector = UPIAppDetectorIOS()
    let upiService = UPIService(detector: detector)
    resolve(upiService.getAvailableApps())
  }

  // Full-screen checkout — presents the SDK view controller
  @objc
  func startCheckout(_ token: String,
                     options: NSDictionary,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      guard let root = RCTPresentedViewController() ??
                       UIApplication.shared.keyWindow?.rootViewController else {
        reject("NO_VC", "No view controller to present from", nil)
        return
      }

      let ui = options["uiConfiguration"] as? NSDictionary

      let vc = SharedKt.BoxPayCheckoutViewController(
        token: token,
        isTestEnv: (options["enableSandboxEnv"] as? Bool) ?? false,
        shopperToken: options["shopperToken"] as? String,
        isSuccessScreenVisible: (options["showSuccessScreen"] as? Bool) ?? false,
        isFailedScreenVisible: (options["showFailedScreen"] as? Bool) ?? false,
        showQROnLoad: (options["showQROnLoad"] as? Bool) ?? false,
        ctaBorderRadius: Int32((ui?["ctaBorderRadius"] as? Int) ?? 12),
        isSICheckBoxChecked: (options["isSICheckBoxChecked"] as? Bool) ?? false,
        isSICheckBoxEnabled: (options["isSICheckBoxEnabled"] as? Bool) ?? false,
        focusedTextInputBorderColor: (ui?["focusedTextInputBorderColor"] as? String) ?? "#2D2B32",
        unfocusedTextInputBorderColor: (ui?["unfocusedTextInputBorderColor"] as? String) ?? "#ADACB0",
        fontFamily: ui?["fontFamily"] as? String
      )

      // Result back to JS via event (set the handler before presenting)
      SDKPaymentResponseHandler().setResultHandler { result in
        CrossPlatformEventEmitter.shared?.sendPaymentResult(result)
      }

      vc.modalPresentationStyle = .fullScreen
      root.present(vc, animated: true)
      resolve(true)
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool { true }  // UI now → main queue
}