// constants/fonts.ts
import * as Font from "expo-font";

export async function loadCustomFonts() {
    await Font.loadAsync({
        'Poppins-Regular': require('../../../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../../../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-ExtraBold': require('../../../assets/fonts/Poppins-ExtraBold.ttf'),
        'Poppins-Medium': require('../../../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SemiBold': require('../../../assets/fonts/Poppins-SemiBold.ttf'),
    });
}
