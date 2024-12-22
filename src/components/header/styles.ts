import { colors, fontFamily } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
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
