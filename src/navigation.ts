import { router } from 'expo-router';
import callUIAnalytics from './postRequest/callUIAnalytics';
import { AnalyticsEvents } from './interface';


export const navigateToEmiScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to EMI Screen","")
  router.push({
      pathname: '/screens/emiScreen',
  });
};

export const navigateToUpiTimerModal = (upiId: string) => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to UPI Timer Screen","")
  router.push({
    pathname: '/screens/upiTimerScreen',
    params: {
      upiId: upiId,
    },
  });
};
export const navigateToCardScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to Cards Screen","")
  router.push({
    pathname: '/screens/cardScreen',
  });
};

export const navigateToWalletScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to Wallet Screen","")
  router.push({
      pathname: '/screens/walletsScreen',
  });
};

export const navigateToNetBankingScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to NetBanking Screen","")
  router.push({
      pathname: '/screens/netBankingScreen',
  });
};

export const navigateToBNPLScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to BNPL Screen","")
  router.push({
    pathname: '/screens/bnplScreen',
  });
};

export const navigateToAddressScreen = () => {
  callUIAnalytics(AnalyticsEvents.PAYMENT_METHOD_SELECTED,"Navigate to Address Screen","")
  router.push({
    pathname: '/screens/addressScreen',
  });
};