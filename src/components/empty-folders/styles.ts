import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    marginBottom: 40,
  },

  textEmpty: {
    fontSize: 18,
    color: colors.gray[500],
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
});
