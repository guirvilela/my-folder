import { colors } from "@/styles/colors";
import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const styled = StyleSheet.create({
  buttonClose: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: colors.gray[400],
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    top: Platform.OS === "ios" ? getStatusBarHeight() + 8 : 20,
    right: 12,
    zIndex: 1,
  },

  buttonTakePicture: {
    width: "100%",
    marginBottom: 32,
    position: "absolute",
    bottom: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
