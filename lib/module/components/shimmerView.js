"use strict";

import { View } from 'react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { jsx as _jsx } from "react/jsx-runtime";
const shimmerHeights = [{
  height: 90,
  marginTop: 10
}, {
  height: 50,
  marginTop: 30
}, {
  height: 50,
  marginTop: 25
}, {
  height: 50,
  marginTop: 25
}, {
  height: 50,
  marginTop: 25
}];
const ShimmerView = () => {
  return /*#__PURE__*/_jsx(View, {
    style: {
      flex: 1,
      backgroundColor: 'white'
    },
    children: shimmerHeights.map((item, index) => /*#__PURE__*/_jsx(ShimmerPlaceHolder, {
      visible: false,
      style: {
        width: '100%',
        height: item.height,
        borderRadius: item.height === 90 ? 0 : 10,
        marginTop: item.marginTop
      }
    }, index))
  });
};
export default ShimmerView;
//# sourceMappingURL=shimmerView.js.map