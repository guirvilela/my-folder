import { colors } from "@/styles/colors";
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { styled } from "./styles";

export function Skeleton() {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoop.start();

    return () => shimmerLoop.stop();
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styled.container}>
      <Animated.View
        style={[
          styled.skeletonContainer,
          { backgroundColor: colors.gray[200], opacity: shimmerOpacity },
        ]}
      />
    </View>
  );
}
