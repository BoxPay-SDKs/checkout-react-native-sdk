// constants/fonts.ts
import * as Font from "expo-font";

export async function loadCustomFonts() {
    await Font.loadAsync({
        'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
        'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
        'Poppins-ExtraBold': require('../assets/fonts/Poppins-ExtraBold.ttf'),
        'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
        'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    });
}

export async function loadInterCustomFonts() {
    await Font.loadAsync({
        'Inter-Regular': require('../assets/fonts/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/Inter_18pt-Bold.ttf'),
        'Inter-ExtraBold': require('../assets/fonts/Inter_18pt-ExtraBold.ttf'),
        'Inter-Medium': require('../assets/fonts/Inter_18pt-Medium.ttf'),
        'Inter-SemiBold': require('../assets/fonts/Inter_18pt-SemiBold.ttf'),
    });
}
