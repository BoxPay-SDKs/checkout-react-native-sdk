import React from 'react';
interface SelectTenureCardProps {
    duration: number;
    monthlyEmiAmount: string;
    interest: number;
    interestCharged: string;
    discount: string;
    totalAmount: string;
    debiitedAmount: string;
    isLowCostOffer: boolean;
    isNoCostOffer: boolean;
    onProceedForward: () => void;
    isSelected: boolean;
    brandColor: string;
    onRadioClick: (duration: number, amount: string) => void;
    currencySymbol: string;
    processingFee: string;
}
declare const SelectTenureCard: React.FC<SelectTenureCardProps>;
export default SelectTenureCard;
//# sourceMappingURL=selectTenureCard.d.ts.map