import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    gap: 16,
  },

  image: {
    width: 140,
    height: 140,
    maxWidth: 140,
    borderRadius: 10,
  },

  textDescription: {
    fontFamily: fontFamily.medium,
    color: colors.gray[600],
    fontSize: 14,
  },

  buttonContainer: {
    width: "100%",
    gap: 8,
  },
});
