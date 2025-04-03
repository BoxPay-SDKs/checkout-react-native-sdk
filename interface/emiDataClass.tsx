export interface CardType {
    cardType: string; // Restricting values
    banks: Bank[];
};

export interface Bank {
    iconUrl: string;
    name: string;
    percent: number;
    noCostApplied: boolean;
    lowCostApplied: boolean;
    emiList: Emi[];
    cardLessEmiValue: string;
    issuerBrand?: string;
};

export interface ChooseEmiModel {
    cards: CardType[];
};

export interface Emi {
    duration: number;
    percent: number;
    amount: string;
    totalAmount: string;
    discount?: string;
    interestCharged?: string;
    noCostApplied: boolean;
    lowCostApplied: boolean;
    processingFee: string;
    code?: string;
    netAmount?: string;
};
