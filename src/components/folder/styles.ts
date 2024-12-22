import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[200],
    width: "100%",
    maxWidth: 160,
    height: 180,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderColor: colors.gray[300],
    borderWidth: 2,
  },

  description: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.gray[600],
    marginTop: 8,
  },
});
