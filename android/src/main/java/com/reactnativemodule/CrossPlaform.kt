package com.reactnativemodule

import android.content.Context
import com.facebook.react.bridge.*
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.crossplatform.BoxPayActivity
import com.crossplatform.sdk.data.handler.SDKPaymentResponseHandler
import com.crossplatform.sdk.data.model.SDKPaymentResponse

class CrossPlatform(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext

    override fun getName(): String = "CrossPlatform"

    @ReactMethod
    fun startCheckout(token: String, options: ReadableMap, promise: Promise) {
        try {
            val activity = reactApplicationContext.currentActivity ?: run {
                promise.reject("NO_ACTIVITY", "No current activity")
                return
            }

            fun flag(key: String) = options.hasKey(key) && options.getBoolean(key)

            val ui = options.getMap("uiConfiguration")
            val ctaBorderRadius = ui?.takeIf { it.hasKey("ctaBorderRadius") }?.getInt("ctaBorderRadius") ?: 12
            val focusedColor = ui?.getString("focusedTextInputBorderColor") ?: "#2D2B32"
            val unfocusedColor = ui?.getString("unfocusedTextInputBorderColor") ?: "#ADACB0"
            val fontFamily = ui?.getString("fontFamily")

            // Result delivery — set BEFORE launching
            SDKPaymentResponseHandler.set { result -> sendPaymentResult(result) }

            activity.runOnUiThread {
                val intent = BoxPayActivity.createIntent(
                    context = activity,
                    token = token,
                    isTestEnv = flag("enableSandboxEnv"),
                    shopperToken = options.getString("shopperToken") ?: "",
                    showQROnLoad = flag("showQROnLoad"),
                    isSICheckBoxEnabled = flag("isSICheckBoxEnabled"),
                    isSICheckBoxChecked = flag("isSICheckBoxChecked"),
                    isFailedScreenVisible = flag("showFailedScreen"),
                    isSuccessScreenVisible = flag("showSuccessScreen"),
                    ctaBorderRadius = ctaBorderRadius,
                    focusedTextInputBorderColor = focusedColor,
                    unfocusedTextInputBorderColor = unfocusedColor,
                    fontFamily = fontFamily
                )
                activity.startActivity(intent)
            }
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("CHECKOUT_ERROR", e)
        }
    }

    private fun sendPaymentResult(result: SDKPaymentResponse) {
        val map = Arguments.createMap().apply {
            putString("status", result.status?.toString())
            putString("transactionId", result.transactionId)
            putString("inquiryToken", result.inquiryToken)
        }
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("BoxPayPaymentResult", map)
    }
}