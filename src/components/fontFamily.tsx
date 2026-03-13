// constants/fonts.ts

import { AnalyticsEvents } from "../interface";
import callUIAnalytics from "../postRequest/callUIAnalytics";

export const BoxpayFonts = {
  'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
  'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  'Poppins-ExtraBold': require('../../assets/fonts/Poppins-ExtraBold.ttf'),
  'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
  'Poppins-SemiBold': require('../../assets/fonts/Poppins-SemiBold.ttf'),

  'Inter-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter_18pt-Bold.ttf'),
  'Inter-ExtraBold': require('../../assets/fonts/Inter_18pt-ExtraBold.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter_18pt-SemiBold.ttf'),
};

export async function loadBoxpayFonts() {
  try {
    // Dynamically check if expo-font exists
    const Font = require('expo-font');

    if (Font?.loadAsync) {
      await Font.loadAsync(BoxpayFonts);
    }
  } catch (e) {
    callUIAnalytics(
      AnalyticsEvents.SDK_CRASH, 'fontfamily.tsx file',`font not loaded ${e}`
    )
  }
}
