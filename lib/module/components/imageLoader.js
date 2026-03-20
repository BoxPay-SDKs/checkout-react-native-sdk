"use strict";

import { useState, useEffect } from "react";
import { SvgXml } from 'react-native-svg';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { Image, View } from "react-native";
import callUIAnalytics from "../postRequest/callUIAnalytics.js";
import { AnalyticsEvents } from "../interface.js";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
const ImageLoader = ({
  image,
  errorImage
}) => {
  const [error, setImageError] = useState(false);
  const [load, setLoad] = useState(true);
  const [extractedImage, setExtractedImage] = useState("");
  const [svgContent, setSvgContent] = useState("");
  useEffect(() => {
    if (image != "") {
      fetch(image).then(response => response.text()).then(text => {
        // 1. CHECK FOR HIDDEN PNGs (Like the Visa logo)
        const base64Match = text.match(/xlink:href="(data:image\/[^"]+)"/);
        if (base64Match && base64Match[1]) {
          setExtractedImage(base64Match[1]);
        } else {
          // 2. CHECK FOR MISSING VIEWBOX (Fixes the cropping issue)
          let finalSvg = text;
          if (!finalSvg.includes('viewBox')) {
            // Try to find width and height to create a viewBox
            const widthMatch = text.match(/width="([^"]+)"/);
            const heightMatch = text.match(/height="([^"]+)"/);
            if (widthMatch && widthMatch[1] && heightMatch && heightMatch[1]) {
              const w = parseFloat(widthMatch[1]);
              const h = parseFloat(heightMatch[1]);

              // Inject the viewBox into the <svg> tag
              // We replace "<svg " with "<svg viewBox="0 0 w h" "
              finalSvg = finalSvg.replace('<svg ', `<svg viewBox="0 0 ${w} ${h}" `);
            }
          }
          setSvgContent(finalSvg);
        }
        setLoad(false);
      }).catch(error => {
        callUIAnalytics(AnalyticsEvents.SDK_CRASH, "Image loader componenet", `${error}`);
        setImageError(true);
        setLoad(false);
      });
    }
  }, [image]);
  return /*#__PURE__*/_jsxs(View, {
    style: {
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center'
    },
    children: [load && !error && /*#__PURE__*/_jsx(ShimmerPlaceHolder, {
      visible: false // Keep shimmer until loading is done
      ,
      style: {
        width: 32,
        height: 32,
        borderRadius: 8
      }
    }), !error && !load && /*#__PURE__*/_jsxs(_Fragment, {
      children: [extractedImage && /*#__PURE__*/_jsx(Image, {
        source: {
          uri: extractedImage
        },
        style: {
          width: '100%',
          height: '100%',
          resizeMode: 'contain' // Keeps the aspect ratio correct inside the square
        }
      }), svgContent && !extractedImage && /*#__PURE__*/_jsx(SvgXml, {
        xml: svgContent,
        width: "100%",
        height: "100%",
        preserveAspectRatio: "xMidYMid meet" // Keeps vectors sharp and centered
      })]
    }), error && /*#__PURE__*/_jsx(Image, {
      source: errorImage,
      style: {
        transform: [{
          scale: 0.4
        }]
      }
    })]
  });
};
export default ImageLoader;
//# sourceMappingURL=imageLoader.js.map