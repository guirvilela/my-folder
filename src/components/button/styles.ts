import { colors, fontFamily } from "@/styles/theme";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    height: 56,
    maxHeight: 56,
    backgroundColor: colors.green.base,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  title: {
    color: colors.gray[100],
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
  },

  defaultButton: {
    color: colors.gray[100],
    backgroundColor: colors.gray[200],
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.gray[200],
  },

  buttonCancel: {
    color: colors.gray[600],
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  buttonTextDefault: {
    fontFamily: fontFamily.medium,
    color: colors.gray[600],
    fontSize: 16,
  },

  buttonDelete: {
    backgroundColor: colors.red.base,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  buttonTextCancel: {
    fontFamily: fontFamily.medium,
    color: colors.gray[600],
    fontSize: 16,
  },

  buttonRename: {
    backgroundColor: colors.green.base,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    fontFamily: fontFamily.medium,
    color: colors.gray[100],
    fontSize: 16,
  },
});
