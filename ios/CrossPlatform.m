#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CrossPlatform, NSObject)

RCT_EXTERN_METHOD(getInstalledApps:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startCheckout:(NSString *)token
                  options:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end