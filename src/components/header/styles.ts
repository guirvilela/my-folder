import { colors, fontFamily } from "@/styles/theme";
import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const styled = StyleSheet.create({
  arrow: {
    paddingTop: Platform.OS === "ios" ? getStatusBarHeight() + 16 : 0,
    width: 26,
    height: 26,
  },
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.gray[500],
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },
});
