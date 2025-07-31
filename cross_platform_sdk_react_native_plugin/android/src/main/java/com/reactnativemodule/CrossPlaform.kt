package com.reactnativemodule

import android.content.Context
import com.crossplatform.android.UPIAppDetectorAndroid
import com.facebook.react.bridge.*

// Import the Arguments class to create a WritableArray
import com.facebook.react.bridge.Arguments

class CrossPlatform(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val context: Context = reactContext

    override fun getName(): String {
        return "CrossPlatform"
    }

    @ReactMethod
    fun getInstalledApps(promise: Promise) {
        try {
            val detector = UPIAppDetectorAndroid(context)
            // Assuming getInstalledUPIApps() returns a List<String>
            val appsList: List<String> = detector.getInstalledUPIApps()

            // 1. Create a WritableArray
            val writableArray: WritableArray = Arguments.createArray()

            // 2. Iterate through the native list and add each element to the WritableArray
            for (app in appsList) {
                writableArray.pushString(app)
            }

            // 3. Resolve the promise with the bridge-compatible WritableArray
            promise.resolve(writableArray)

        } catch (e: Exception) {
            promise.reject("ERROR_UPI_APPS", e)
        }
    }
}