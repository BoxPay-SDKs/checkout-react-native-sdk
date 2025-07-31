#import <React/RCTBridgeModule.h>

// This exposes the Swift class "CrossPlatform" to React Native.
@interface RCT_EXTERN_MODULE(CrossPlatform, NSObject)

// This exposes the getInstalledApps method.
RCT_EXTERN_METHOD(getInstalledApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end