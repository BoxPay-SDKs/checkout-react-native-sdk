import Foundation
import cross_platform_sdk
import React
import UIKit

@objc(BoxPayElementsViewManager)
class BoxPayElementsViewManager: RCTViewManager {
  override func view() -> UIView! { BoxPayElementsContainer() }
  override static func requiresMainQueueSetup() -> Bool { true }

  // command from JS to trigger payment
  @objc func pay(_ node: NSNumber) {
    DispatchQueue.main.async {
      guard let view = self.bridge.uiManager.view(forReactTag: node) as? BoxPayElementsContainer
      else { return }
      view.pay()
    }
  }
}

class BoxPayElementsContainer: UIView {
  private var handler: BoxPayElementsHandler?
  private var hosted: UIViewController?

  @objc var onPayableChanged: RCTDirectEventBlock?

  @objc var config: NSDictionary? {
    didSet { rebuild() }
  }

  private func rebuild() {
    guard let config = config, let token = config["token"] as? String else { return }
    subviews.forEach { $0.removeFromSuperview() }

    let handler = BoxPayElementsHandler()
    self.handler = handler

    let methods = (config["paymentMethodList"] as? [String]) ?? []

    let vc = BoxPayElementsViewControllerKt.BoxPayElementsViewController(
        token: token,
        isTestEnv: (config["isTestEnv"] as? Bool) ?? false,
        shopperToken: config["shopperToken"] as? String,
        showQROnLoad: (config["showQROnLoad"] as? Bool) ?? false,
        ctaBorderRadius: Int32(
            (config["ctaBorderRadius"] as? Int) ?? 12
        ),
        isSICheckBoxChecked:
            (config["isSICheckBoxChecked"] as? Bool) ?? false,
        isSICheckBoxEnabled:
            (config["isSICheckBoxEnabled"] as? Bool) ?? false,
        focusedTextInputBorderColor:
            (config["focusedTextInputBorderColor"] as? String) ?? "#2D2B32",
        unfocusedTextInputBorderColor:
            (config["unfocusedTextInputBorderColor"] as? String) ?? "#ADACB0",
        paymentMethodList: methods,
        isBoxPayProceedButtonVisible:
            (config["isBoxPayProceedButtonVisible"] as? Bool) ?? false,
        fontFamily: config["fontFamily"] as? String,
        handler: handler,
        onDismiss: { [weak self] in
            // SDK dismissed
            self?.hosted = nil
        }
    )
    self.hosted = vc

//     // payable state → JS
//     handler.setOnPayableChanged(listener: PayableListener { [weak self] payable in
//   self?.onPayableChanged?(["payable": payable])
// })

    vc.view.frame = bounds
    vc.view.autoresizingMask = [
    UIView.AutoresizingMask.flexibleWidth,
    UIView.AutoresizingMask.flexibleHeight
    ]
    addSubview(vc.view)
  }

  func pay() { handler?.pay() }
}