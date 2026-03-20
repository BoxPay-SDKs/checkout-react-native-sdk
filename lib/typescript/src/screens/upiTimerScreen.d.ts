import type { CheckoutStackParamList } from '../navigation';
import type { RouteProp, NavigationProp } from '@react-navigation/native';
type UpiTimerScreenRouteProp = RouteProp<CheckoutStackParamList, 'UpiTimerScreen'>;
type UpiTimercreenNavigationProp = NavigationProp<CheckoutStackParamList, 'UpiTimerScreen'>;
interface Props {
    route: UpiTimerScreenRouteProp;
    navigation: UpiTimercreenNavigationProp;
}
declare const UpiTimerScreen: ({ route, navigation }: Props) => import("react/jsx-runtime").JSX.Element;
export default UpiTimerScreen;
//# sourceMappingURL=upiTimerScreen.d.ts.map