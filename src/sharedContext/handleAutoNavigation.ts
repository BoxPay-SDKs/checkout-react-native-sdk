import { type PaymentClass } from '../interface';
import { checkoutDetailsHandler } from './checkoutDetailsHandler';
import { userDataHandler } from './userdataHandler';


export const handleAutoNavigation = (
    savedCardArray : PaymentClass[],
    navigateToCardScreen : () => void,
    navigateToWalletScreen : () => void,
    navigateToNetBankingScreen : () => void,
    navigateToEMIScreen : () => void,
    navigateToBNPLScree : () => void
) : boolean => {
    const {checkoutDetails} = checkoutDetailsHandler
    const {userData} = userDataHandler 

    if (checkoutDetails.isOrderItemDetailsVisible) return false;

    if (savedCardArray.length > 0) return false;

    const isPersonalDataMissing = 
    (checkoutDetails.isFullNameEnabled && (!userData.firstName || userData.firstName.trim() === "")) ||
    (checkoutDetails.isEmailEnabled && (!userData.email || userData.email.trim() === "")) ||
    (checkoutDetails.isPhoneEnabled && (!userData.completePhoneNumber || userData.completePhoneNumber.trim() === ""));

    if (isPersonalDataMissing) return false;

    const isShippingDataMissing = checkoutDetails.isShippingAddressEnabled && (!userData.address1 || !userData.city || !userData.pincode);

    if (isShippingDataMissing) return false;

    const isUPIEnabled = checkoutDetails.isUpiCollectMethodEnabled || 
                        checkoutDetails.isUPIOtmCollectMethodEnabled || 
                        checkoutDetails.isUPIOtmIntentMethodEnabled || 
                        checkoutDetails.isUpiIntentMethodEnabled || 
                        checkoutDetails.isUpiQRMethodEnabled || 
                        checkoutDetails.isUPIOtmQRMethodEnabled

    const enabledMethods = [];
    if (isUPIEnabled) enabledMethods.push('UPI');
    if (checkoutDetails.isCardMethodEnabled) enabledMethods.push('CARD');
    if (checkoutDetails.isWalletMethodEnabled) enabledMethods.push('WALLET');
    if (checkoutDetails.isNetBankingMethodEnabled) enabledMethods.push('NETBANKING');
    if (checkoutDetails.isEmiMethodEnabled) enabledMethods.push('EMI');
    if (checkoutDetails.isBnplMethodEnabled) enabledMethods.push('BNPL');

    if (enabledMethods.length === 1) {
        const targetMethod = enabledMethods[0];

        switch (targetMethod) {
            case 'CARD' :
                navigateToCardScreen()
                return true;
            
            case 'WALLET' :
                navigateToWalletScreen()
                return true;
            
            case 'NETBANKING':
                navigateToNetBankingScreen()
                return true;

            case 'EMI':
                navigateToEMIScreen()
                return true;

            case 'BNPL':
                navigateToBNPLScree()
                return true;
        }
    }
    return false;
}