import { colors } from "@/styles/colors";
import { IconProps as TablerIconProps } from "@tabler/icons-react-native";
import {
  ActivityIndicator,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { styled } from "./styles";

interface ButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
  variant?: "default" | "delete" | "rename" | "cancel";
}

interface TextProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  variant?: "default" | "delete" | "rename" | "cancel";
}

function Button({
  children,
  style,
  isLoading = false,
  variant,
  ...rest
}: ButtonProps) {
  const variantStyle =
    variant === "delete"
      ? styled.buttonDelete
      : variant === "rename"
      ? styled.buttonRename
      : variant === "cancel"
      ? styled.buttonCancel
      : variant === "default"
      ? styled.defaultButton
      : styled.container;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        variantStyle,
        style,
        isLoading && { backgroundColor: colors.gray[300] },
      ]}
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.gray[100]} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

function Title({ children, style, variant }: TextProps) {
  const textStyle =
    variant === "cancel" || variant === "default"
      ? styled.buttonTextDefault
      : styled.buttonText;

  return <Text style={[textStyle, style]}>{children}</Text>;
}

interface IconProps {
  icon: React.ComponentType<TablerIconProps>;
}

function Icon({ icon: Icon }: IconProps) {
  return <Icon size={24} color={colors.gray[100]} />;
}

Button.Title = Title;
Button.Icon = Icon;

export { Button };
