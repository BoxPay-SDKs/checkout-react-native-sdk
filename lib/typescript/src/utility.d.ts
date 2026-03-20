import type { PaymentMethod, PaymentClass, DeliveryAddress, CountryDetails } from './interface';
export declare function transformAndFilterList(data: PaymentMethod[], filterType: string): PaymentClass[];
export declare function getDeviceDetails(): {
    browser: "ios" | "android" | "windows" | "macos" | "web";
    platformVersion: string;
    deviceType: string;
    deviceName: string;
    deviceBrandName: string;
};
export declare function getBrowserData(): {
    screenHeight: string;
    screenWidth: string;
    acceptHeader: string;
    userAgentHeader: string;
    browserLanguage: string;
    ipAddress: string;
    colorDepth: number;
    javaEnabled: boolean;
    timeZoneOffSet: number;
    packageId: string;
};
export declare function getShopperDetails(): {
    email: string | null;
    firstName: string | null;
    gender: null;
    lastName: string | null;
    phoneNumber: string | null;
    uniqueReference: string | null;
    dateOfBirth: string | null;
    panNumber: string | null;
    deliveryAddress: {
        address1: string | null;
        address2: string | null;
        city: string | null;
        state: string | null;
        countryCode: string | null;
        postalCode: string | null;
        labelType: string | null;
        labelName: string | null;
    } | null;
};
export declare const height: number, width: number;
export declare const useCountdown: (initialSeconds: number) => {
    timeRemaining: number;
    start: () => void;
    stop: () => void;
};
export declare function getEndpoint(env: string): string;
export declare function generateRandomAlphanumericString(length: number): string;
export declare function getBaseURL(env: string): string;
export declare function formatAddress(deliveryAddress: DeliveryAddress): string;
export declare function extractNames(fullName: string): {
    firstName: string;
    lastName: string;
};
export declare const formatTime: (timeRemaining: number) => string;
export declare const formatExpiry: (input: string) => string;
export declare const getPhoneNumberCodeAndCountryName: (countryCodeRef: string) => CountryDetails | any;
//# sourceMappingURL=utility.d.ts.map