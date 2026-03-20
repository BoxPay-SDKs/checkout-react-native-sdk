import type { RouteProp, NavigationProp } from '@react-navigation/native';
import type { CheckoutStackParamList } from '../navigation';
type CardScreenRouteProp = RouteProp<CheckoutStackParamList, 'CardScreen'>;
type CardScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'CardScreen'>;
interface Props {
    route: CardScreenRouteProp;
    navigation: CardScreenNavigationProp;
}
declare const CardScreen: ({ route, navigation }: Props) => import("react/jsx-runtime").JSX.Element;
export default CardScreen;
//# sourceMappingURL=cardScreen.d.ts.map