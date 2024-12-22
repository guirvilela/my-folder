import { colors } from "@/styles/colors";
import { IconProps as TablerIconProps } from "@tabler/icons-react-native";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styled } from "./styles";

interface FolderProps {
  icon: React.ComponentType<TablerIconProps>;
  description: string;
  onNavigate: () => void;
  onLongPress: () => void;
}

export function Folder({
  icon: Icon,
  description,
  onNavigate,
  onLongPress,
}: FolderProps) {
  return (
    <>
      <TouchableOpacity
        style={styled.container}
        activeOpacity={0.8}
        onPress={onNavigate}
        onLongPress={onLongPress}
      >
        <Icon color={colors.gray[500]} size={58} />
        <Text style={styled.description} numberOfLines={2}>
          {description}
        </Text>
      </TouchableOpacity>
    </>
  );
}
