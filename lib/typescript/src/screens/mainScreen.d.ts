import { type NavigationProp, type RouteProp } from "@react-navigation/native";
import type { CheckoutStackParamList } from '../navigation';
type MainScreenRouteProp = RouteProp<CheckoutStackParamList, 'MainScreen'>;
type MainScreenNavigationProp = NavigationProp<CheckoutStackParamList, 'MainScreen'>;
interface MainScreenProps {
    route: MainScreenRouteProp;
    navigation: MainScreenNavigationProp;
}
declare const MainScreen: ({ route, navigation }: MainScreenProps) => import("react/jsx-runtime").JSX.Element;
export default MainScreen;
//# sourceMappingURL=mainScreen.d.ts.map