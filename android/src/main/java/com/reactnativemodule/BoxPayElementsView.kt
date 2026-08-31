package com.reactnativemodule

import android.view.View
import com.crossplatform.BoxPayElementsView
import com.crossplatform.sdk.data.handler.BoxPayElementsHandler
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class BoxPayElementsViewManager(
    private val reactContext: ReactApplicationContext
) : SimpleViewManager<View>() {

    // one handler per view instance so the merchant's button can drive it
    private val handlers = mutableMapOf<View, BoxPayElementsHandler>()

    override fun getName() = "BoxPayElementsView"

    override fun createViewInstance(context: ThemedReactContext): View {
        // placeholder until props (token, methods) arrive; rebuilt in the props below
        return android.widget.FrameLayout(context)
    }

    @ReactProp(name = "config")
    fun setConfig(parent: View, config: com.facebook.react.bridge.ReadableMap) {
        val container = parent as android.widget.FrameLayout
        val handler = BoxPayElementsHandler()
        handlers[parent] = handler

        val methods = config.getArray("paymentMethodList")
            ?.toArrayList()?.filterIsInstance<String>() ?: emptyList()

        val view = BoxPayElementsView.create(
            context = reactContext.currentActivity ?: reactContext,
            handler = handler,
            token = config.getString("token") ?: "",
            isTestEnv = config.hasKey("isTestEnv") && config.getBoolean("isTestEnv"),
            paymentMethodList = methods,
            fontFamily = config.getString("fontFamily"),
            isBoxPayProceedButtonVisible = true
        )

        // forward payable state to JS
        handler.setOnPayableChanged { payable ->
            val event = com.facebook.react.bridge.Arguments.createMap().apply {
                putBoolean("payable", payable)
            }
            reactContext.getJSModule(
                com.facebook.react.uimanager.events.RCTEventEmitter::class.java
            ).receiveEvent(parent.id, "onPayableChanged", event)
        }

        container.removeAllViews()
        container.addView(view)
    }

    // merchant calls pay() through a command
    override fun receiveCommand(root: View, commandId: String?, args: com.facebook.react.bridge.ReadableArray?) {
        if (commandId == "pay") handlers[root]?.pay()
    }
}