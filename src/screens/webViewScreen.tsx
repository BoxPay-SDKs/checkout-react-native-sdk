import React from 'react';
import { WebView } from 'react-native-webview';

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
  const source = html
    ? { html: html }
    : url
      ? { uri: url }
      : { html: '<h1>No content provided</h1>' };

  return (
    <WebView
      source={source}
      {...props}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      onLoadEnd={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        if (nativeEvent.url.includes('boxpay')) {
          onBackPress();
        }
      }}
    />
  );
};

export default WebViewScreen;
