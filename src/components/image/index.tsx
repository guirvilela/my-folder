import { formatDate } from "@/formats/date";
import React from "react";
import { Image as RNImage, Text, TouchableOpacity, View } from "react-native";
import { styled } from "./styles";

interface ImageProps {
  uri: string;
  description?: string;
  createdAt?: string;
  onLoading: () => void;
  onLoadEnd: () => void;
  onLongPress: () => void;
}

export function Image({
  uri,
  description,
  createdAt,
  onLoading,
  onLoadEnd,
  onLongPress,
}: ImageProps) {
  return (
    <TouchableOpacity
      style={styled.container}
      activeOpacity={0.8}
      onLongPress={onLongPress}
    >
      <RNImage
        source={{ uri }}
        style={styled.image}
        resizeMode="cover"
        onLoad={onLoading}
        onLoadEnd={onLoadEnd}
      />

      <View style={styled.descriptionContainer}>
        <Text style={styled.description} numberOfLines={1}>
          {description || "Sem descrição"}
        </Text>
        <View style={styled.createdAt}>
          <Text style={styled.createdAtText}>{formatDate(createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
