import { formatDate } from "@/formats/date";
import React from "react";
import { Image as RNImage, Text, TouchableOpacity, View } from "react-native";
import { Skeleton } from "../skeleton";
import { styled } from "./styles";

interface ImageProps {
  uri: string;
  description?: string;
  createdAt?: string;
  onPress: () => void;
  onLongPress: () => void;
}

export function Image({
  uri,
  description,
  createdAt,
  onPress,
  onLongPress,
}: ImageProps) {
  const [isLoadingImage, setIsLoadingImage] = React.useState(true);

  return (
    <TouchableOpacity
      style={styled.container}
      activeOpacity={0.8}
      onLongPress={onLongPress}
      onPress={onPress}
    >
      {isLoadingImage && <Skeleton />}
      <RNImage
        source={{ uri }}
        style={styled.image}
        resizeMode="cover"
        onLoad={() => setIsLoadingImage(false)}
      />

      {!isLoadingImage && (
        <View style={styled.descriptionContainer}>
          <Text style={styled.description} numberOfLines={1}>
            {description || "Sem descrição"}
          </Text>
          <View style={styled.createdAt}>
            <Text style={styled.createdAtText}>{formatDate(createdAt)}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
