import { colors, fontFamily } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    maxWidth: 160,
    height: 180,
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: 146,
    maxWidth: 160,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  descriptionContainer: {
    width: "100%",
    flex: 1,

    borderTopWidth: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: colors.gray[300],
    borderWidth: 1,
  },
  description: {
    fontFamily: fontFamily.semiBold,
    marginTop: 4,
    fontSize: 14,
    textAlign: "center",

    color: colors.gray[600],
  },
});
