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
    position: "relative",
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

  imageLoading: {
    position: "absolute",
    top: 20,
    alignItems: "center",
    justifyContent: "center",
    width: 140,
    height: 140,
    borderWidth: 2,
    borderColor: colors.gray[200],
    borderRadius: 10,
    zIndex: 1,
  },

  textDescription: {
    fontFamily: fontFamily.medium,
    color: colors.gray[600],
    fontSize: 14,
    flex: 1,
  },

  buttonContainer: {
    width: "100%",
    gap: 8,
  },

  titleContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  changeDescriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 5,
    marginBottom: 20,
    maxHeight: 58,
  },

  changeDescriptionInput: {
    flex: 1,
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    backgroundColor: "transparent",
    width: "100%",
    padding: 10,
  },
});
