import { colors } from "@/styles/colors";
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    width: "100%",
    gap: 8,
  },

  button: {
    color: colors.gray[600],
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonDelete: {
    backgroundColor: colors.red.base,
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
  },

  buttonTextCancel: {
    color: colors.gray[600],
    fontSize: 16,
  },
});
