import { Loading } from "@/components/loading";
import { colors } from "@/styles/colors";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { getApps } from "firebase/app";
import { useCallback, useEffect } from "react";
import { View } from "react-native";
import "react-native-reanimated";
import { app } from "../../firebaseConfig";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Verificar se o Firebase está inicializado
    if (getApps().length === 0) {
      console.error("Firebase não foi inicializado corretamente!");
    } else {
      console.log("Firebase inicializado com sucesso:", app.name);
    }

    if (fontsLoaded) {
      onLayout();
    }
  }, [fontsLoaded, onLayout]);

  if (!fontsLoaded) {
    return <Loading />;
  }

  return (
    <View onLayout={onLayout} style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.gray[100],
          },
        }}
      />
    </View>
  );
}
