import { colors } from "@/styles/colors";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.green.light,
  },
});
