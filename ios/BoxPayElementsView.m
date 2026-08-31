#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(BoxPayElementsViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(config, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(onPayableChanged, RCTDirectEventBlock)

RCT_EXTERN_METHOD(pay:(nonnull NSNumber *)node)

@end