import { router } from 'expo-router';


export const navigateToEmiScreen = () => {
    router.push({
        pathname: '/sdk/screens/emiScreen',
    });
};

export const navigateToUpiTimerModal = (upiId: string) => {
    router.push({
      pathname: '/sdk/screens/upiTimerScreen',
      params: {
        upiId: upiId,
      },
    });
};
export const navigateToCardScreen = () => {
    router.push({
      pathname: '/sdk/screens/cardScreen',
    });
};

export const navigateToWalletScreen = () => {
    router.push({
        pathname: '/sdk/screens/walletsScreen',
    });
};

export const navigateToNetBankingScreen = () => {
    router.push({
        pathname: '/sdk/screens/netBankingScreen',
    });
};

export const navigateToBNPLScreen = () => {
    router.push({
      pathname: '/sdk/screens/bnplScreen',
    });
};

export const navigateToAddressScreen = () => {
    router.push({
      pathname: '/sdk/screens/addressScreen',
    });
};