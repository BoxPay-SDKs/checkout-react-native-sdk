import { ScreenRouteMap, type AutoNavigationScreen, type PaymentClass } from '../interface';
import { checkoutDetailsHandler } from './checkoutDetailsHandler';
import { userDataHandler } from './userdataHandler';


export const handleAutoNavigation = (
    status : String,
    savedCardArray : PaymentClass[]
) : AutoNavigationScreen | null => {
    const {checkoutDetails} = checkoutDetailsHandler
    const {userData} = userDataHandler 

    if (checkoutDetails.isOrderItemDetailsVisible) return null;

    if (savedCardArray.length > 0) return null;

    if(status !== "NOACTION") return null

    const isPersonalDataMissing = 
    (checkoutDetails.isFullNameEnabled && (!userData.firstName || userData.firstName.trim() === "")) ||
    (checkoutDetails.isEmailEnabled && (!userData.email || userData.email.trim() === "")) ||
    (checkoutDetails.isPhoneEnabled && (!userData.completePhoneNumber || userData.completePhoneNumber.trim() === ""));

    if (isPersonalDataMissing) return null;

    const isShippingDataMissing = checkoutDetails.isShippingAddressEnabled && (!userData.address1 || !userData.city || !userData.pincode);

    if (isShippingDataMissing) return null;

    const isUPIEnabled = checkoutDetails.isUpiCollectMethodEnabled || 
                        checkoutDetails.isUPIOtmCollectMethodEnabled || 
                        checkoutDetails.isUPIOtmIntentMethodEnabled || 
                        checkoutDetails.isUpiIntentMethodEnabled || 
                        checkoutDetails.isUpiQRMethodEnabled || 
                        checkoutDetails.isUPIOtmQRMethodEnabled

    const enabledMethods: (keyof typeof ScreenRouteMap & (
    'CARD' | 'WALLET' | 'NETBANKING' | 'EMI' | 'BNPL'
    ))[] = [];
    if (checkoutDetails.isCardMethodEnabled) enabledMethods.push('CARD');
    if (checkoutDetails.isWalletMethodEnabled) enabledMethods.push('WALLET');
    if (checkoutDetails.isNetBankingMethodEnabled) enabledMethods.push('NETBANKING');
    if (checkoutDetails.isEmiMethodEnabled) enabledMethods.push('EMI');
    if (checkoutDetails.isBnplMethodEnabled) enabledMethods.push('BNPL');

    if (enabledMethods.length === 1 && !isUPIEnabled) {
        const method = enabledMethods[0];
        if (!method) return null
        return ScreenRouteMap[method];
    }
    
    return null;
}