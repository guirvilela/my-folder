import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { styled } from "./styles";

type Props = TextInputProps & {
  size?: "small" | "medium" | "large";
};

export function Input({ size = "large", ...rest }: Props) {
  return <TextInput style={[styled.input, styled[size]]} {...rest} />;
}
