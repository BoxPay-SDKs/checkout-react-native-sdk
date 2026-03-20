export interface OrderDetailsProps {
    totalAmount: string;
    itemsArray: ItemsProp[];
    subTotalAmount: string;
    shippingAmount: string;
    taxAmount: string;
    surchargeDetails: SurchargeProp[];
    selectedPaymentMethod: string;
}
export interface ItemsProp {
    imageUrl: string;
    imageTitle: string;
    imageOty: number;
    imageAmount: string;
}
export interface SurchargeProp {
    title: string;
    amount: number;
    applicable: string;
}
declare const OrderDetails: ({ totalAmount, itemsArray, subTotalAmount, shippingAmount, taxAmount, surchargeDetails, selectedPaymentMethod }: OrderDetailsProps) => import("react/jsx-runtime").JSX.Element;
export default OrderDetails;
//# sourceMappingURL=orderDetails.d.ts.map