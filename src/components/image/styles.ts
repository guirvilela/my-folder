import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { StyleSheet } from "react-native";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: 164,
    marginBottom: 14,
    maxWidth: 164,
    height: 160,
  },
  image: {
    width: 164,
    height: 130,
    maxWidth: 164,
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  descriptionContainer: {
    position: "relative",
    width: 165,
    backgroundColor: colors.green.base,
    height: 50,
    borderTopWidth: 0,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: colors.gray[300],
    borderWidth: 1,
    paddingHorizontal: 8,
  },

  description: {
    fontFamily: fontFamily.semiBold,
    marginTop: 4,
    fontSize: 14,
    color: colors.gray[100],
  },

  createdAt: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },

  createdAtText: {
    fontFamily: fontFamily.semiBold,
    marginTop: 4,
    fontSize: 10,
    color: colors.gray[100],
  },
});
