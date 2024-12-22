import React from "react";
import { Image as RNImage, Text, TouchableOpacity, View } from "react-native";
import { styled } from "./styles";

interface ImageProps {
  description: string;
  uri: string;
}

export function Image({ description, uri }: ImageProps) {
  return (
    <TouchableOpacity style={styled.container} activeOpacity={0.8}>
      <RNImage source={{ uri }} style={styled.image} resizeMode="cover" />

      <View style={styled.descriptionContainer}>
        <Text style={styled.description} numberOfLines={1}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
