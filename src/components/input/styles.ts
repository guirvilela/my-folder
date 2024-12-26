import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  input: {
    fontFamily: fontFamily.medium,
    maxHeight: 50,
    height: 50,
    backgroundColor: colors.gray[200],
    borderRadius: 5,
    paddingLeft: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
  },
  small: {
    width: 60,
    height: 60,
    textAlign: "center",
    padding: 0,
  },
  medium: {
    flex: 1,
  },
  large: {
    width: "100%",
  },
});
