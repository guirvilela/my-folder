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
  },

  titleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  title: {
    flex: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
  },

  renameContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 5,
    marginBottom: 20,
    maxHeight: 58,
  },

  renameInput: {
    flex: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    backgroundColor: "transparent",
    width: "100%",
    padding: 10,
  },

  buttonContainer: {
    width: "100%",
    gap: 8,
  },
});
