import { colors } from "@/styles/colors";
import { fontFamily } from "@/styles/font-family";
import { Platform, StyleSheet } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

export const styled = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: colors.gray[600],
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  preview: {
    // flex: 1,
    // paddingBottom: 40,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  buttonText: {
    fontFamily: fontFamily.semiBold,
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
  },

  buttonContainer: {
    position: "relative",
    bottom: Platform.OS == "ios" ? 20 : 10,
    gap: 12,
    height: 100,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  buttonClose: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: colors.gray[400],
    alignItems: "center",
    justifyContent: "center",
    width: 38,
    height: 38,
    top: Platform.OS === "ios" ? getStatusBarHeight() + 8 : 20,
    right: 12,
    zIndex: 1,
  },

  input: {
    position: "absolute",
    top: -50,
    zIndex: 1,
    width: "85%",
    color: colors.gray[200],
    height: 54,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: fontFamily.medium,
    backgroundColor: colors.gray[600],
  },

  circularLoadingContainer: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
  },

  previewDescription: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },

  textPreview: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: "white",
    textAlign: "left",
  },

  imageContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    flex: 1,
    zIndex: 2,
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray[600],
  },
});
