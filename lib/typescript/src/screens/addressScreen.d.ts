import type { CheckoutStackParamList } from '../navigation';
import type { NavigationProp, RouteProp } from '@react-navigation/native';
type AddressScreenRouteProp = RouteProp<CheckoutStackParamList, 'AddressScreen'>;
type AddressScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'AddressScreen'>;
interface Props {
    route: AddressScreenRouteProp;
    navigation: AddressScreenNavigationProp;
}
declare const AddressScreen: ({ route, navigation }: Props) => import("react/jsx-runtime").JSX.Element;
export default AddressScreen;
//# sourceMappingURL=addressScreen.d.ts.map