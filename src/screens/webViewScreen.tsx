import React, { useState, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';

interface WebViewScreenProps {
  url: string | null;
  html: string | null;
  onBackPress: () => void;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({
  url,
  html,
  onBackPress,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState(url ?? '');  // ← track URL
  const hasCalledBack = useRef(false);                       // ← prevent double call

  const source = html
    ? { html: html }
    : url
      ? { uri: url }
      : { html: '<h1>No content provided</h1>' };

  const checkUrl = (navUrl: string) => {
    setCurrentUrl(navUrl);
  
    if (navUrl.includes('payment-completion-handler') && !hasCalledBack.current && navUrl.includes('boxpay')) {
      hasCalledBack.current = true;
      onBackPress();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* URL Search Bar - shows every redirect */}
      <View style={styles.searchBar}>
        <Text numberOfLines={1} style={styles.searchBarText}>
          {currentUrl}
        </Text>
      </View>

      <WebView
        source={source}
        {...props}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onNavigationStateChange={(navState: WebViewNavigation) => checkUrl(navState.url)}
        onShouldStartLoadWithRequest={(request: ShouldStartLoadRequest) => {
          checkUrl(request.url);
          return true;
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="#1a1a6e" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  searchBar: {
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchBarText: {
    fontSize: 11,
    color: '#333',
  },
});

export default WebViewScreen;