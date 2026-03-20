import type { GetInstantOffersResponse } from '../interface';
import type { CheckoutStackParamList } from '../navigation';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
export interface InstantOfferProps {
    couponList: GetInstantOffersResponse[];
    selectedCouponCode: string;
    selectedColor: string;
    onClickCoupon: (code: string) => void;
    onClickRemoveCoupon: () => void;
}
type InstantOfferNavigationProp = NavigationProp<CheckoutStackParamList, 'InstantOfferScreen'>;
type InstantOfferRouteProp = RouteProp<CheckoutStackParamList, 'InstantOfferScreen'>;
interface Props {
    route: InstantOfferRouteProp;
    navigation: InstantOfferNavigationProp;
}
declare const InstantOfferScreen: ({ route, navigation }: Props) => import("react/jsx-runtime").JSX.Element;
export default InstantOfferScreen;
//# sourceMappingURL=instantOfferList.d.ts.map