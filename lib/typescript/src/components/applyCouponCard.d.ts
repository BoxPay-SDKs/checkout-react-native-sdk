import React from 'react';
interface Props {
    selectedColor: string;
    code: string;
    description: string;
    discountAmount: string;
    currencySymbol: string;
    isCodeApplied: boolean;
    onClickApply: (code: string) => void;
    onClickRemove: () => void;
    onClickViewAll: () => void;
}
declare const ApplyCouponCard: React.FC<Props>;
export default ApplyCouponCard;
//# sourceMappingURL=applyCouponCard.d.ts.map