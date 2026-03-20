"use strict";

import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const WebViewScreen = ({
  url,
  html,
  onBackPress,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url ?? ''); // ← track URL
  const hasCalledBack = useRef(false); // ← prevent double call

  const source = html ? {
    html: html
  } : url ? {
    uri: url
  } : {
    html: '<h1>No content provided</h1>'
  };
  const checkUrl = navUrl => {
    setCurrentUrl(navUrl);
    if (navUrl.includes('payment-completion-handler') && !hasCalledBack.current && navUrl.includes('boxpay')) {
      hasCalledBack.current = true;
      onBackPress();
    }
  };
  return /*#__PURE__*/_jsxs(View, {
    style: {
      flex: 1
    },
    children: [/*#__PURE__*/_jsx(View, {
      style: styles.searchBar,
      children: /*#__PURE__*/_jsx(Text, {
        numberOfLines: 1,
        style: styles.searchBarText,
        children: currentUrl
      })
    }), /*#__PURE__*/_jsx(WebView, {
      source: source,
      ...props,
      style: {
        flex: 1
      },
      javaScriptEnabled: true,
      domStorageEnabled: true,
      startInLoadingState: true,
      onNavigationStateChange: navState => checkUrl(navState.url),
      onShouldStartLoadWithRequest: request => {
        checkUrl(request.url);
        return true;
      },
      onLoadStart: () => setIsLoading(true),
      onLoadEnd: () => setIsLoading(false)
    }), isLoading && /*#__PURE__*/_jsx(View, {
      style: styles.loaderOverlay,
      children: /*#__PURE__*/_jsx(ActivityIndicator, {
        size: "large",
        color: "#1a1a6e"
      })
    })]
  });
};
const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
  searchBar: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  searchBarText: {
    fontSize: 11,
    color: '#333'
  }
});
export default WebViewScreen;
//# sourceMappingURL=webViewScreen.js.map