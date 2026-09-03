import Foundation
import cross_platform_sdk
import React

@objc(CrossPlatform)
class CrossPlatform: RCTEventEmitter {

  // MARK: - Track listener state ourselves (hasListeners isn't visible from Swift here)
  private var hasObservers = false

  override func startObserving() {
    hasObservers = true
  }

  override func stopObserving() {
    hasObservers = false
  }

  // MARK: - RCTEventEmitter requirements

  override func supportedEvents() -> [String]! {
    return ["BoxPayPaymentResult", "BoxPayDismiss"]
  }

  @objc
  override static func moduleName() -> String! { "CrossPlatform" }

  @objc
  override static func requiresMainQueueSetup() -> Bool { true }

  // MARK: - startCheckout

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
      var vc: UIViewController!

      vc = BoxPayViewControllerKt.BoxPayViewController(
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
        onDismiss: { [weak self, weak vc] in
          DispatchQueue.main.async {
            vc?.dismiss(animated: true)
          }
          guard let self = self, self.hasObservers else { return }
          self.sendEvent(withName: "BoxPayDismiss", body: nil)
        },
        fontFamily: ui?["fontFamily"] as? String
      )

      SDKPaymentResponseHandler.shared.set { [weak self] result in
        guard let self = self, self.hasObservers else { return }

        let map: [String: Any] = [
          "status": result.status ?? NSNull(),
          "transactionId": result.transactionId ?? NSNull(),
          "inquiryToken": result.inquiryToken ?? NSNull()
        ]

        self.sendEvent(withName: "BoxPayPaymentResult", body: map)
      }

      vc.modalPresentationStyle = .fullScreen
      root.present(vc, animated: true)
      resolve(true)
    }
  }
}