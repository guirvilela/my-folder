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
}

export function Image({
  uri,
  description,
  createdAt,
  onLoading,
  onLoadEnd,
}: ImageProps) {
  return (
    <TouchableOpacity
      style={description ? styled.container : styled.containerNoDescription}
      activeOpacity={0.8}
    >
      <RNImage
        source={{ uri }}
        style={description ? styled.image : styled.imageNoDescription}
        resizeMode="cover"
        onLoad={onLoading}
        onLoadEnd={onLoadEnd}
      />

      {description ? (
        <View style={styled.descriptionContainer}>
          <Text style={styled.description} numberOfLines={1}>
            {description}
          </Text>
          <View style={styled.createdAt}>
            <Text style={styled.createdAtText}>{formatDate(createdAt)}</Text>
          </View>
        </View>
      ) : (
        <Text style={styled.description}>{description}</Text>
      )}
    </TouchableOpacity>
  );
}
