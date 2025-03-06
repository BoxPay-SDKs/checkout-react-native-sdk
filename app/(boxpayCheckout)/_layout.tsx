import React from 'react'
import { Stack } from 'expo-router'


const BoxpayCheckoutLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='index' options={{ headerShown: false }} />
      <Stack.Screen name='(screens)/upiTimerScreen' options={{ headerShown: false }} />
      <Stack.Screen name='(screens)/cardScreen' options={{ headerShown: false }} />
      <Stack.Screen name='(screens)/upiScreen' options={{ headerShown: false }} />
      <Stack.Screen name='(screens)/webViewScreen' options={{ headerShown: false }} />
    </Stack>
  )
}

export default BoxpayCheckoutLayout