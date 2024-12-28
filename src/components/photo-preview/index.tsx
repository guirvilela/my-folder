import { FoldersForm } from "@/hooks/details";
import { Form } from "@/hooks/form";
import { Action } from "@/hooks/http";
import { FormCamera } from "@/hooks/picture";
import { colors } from "@/styles/colors";
import { IconSend2, IconShare, IconX } from "@tabler/icons-react-native";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import { Button } from "../button";
import { Input } from "../input";
import { CircularProgress } from "../loadingProgress";
import { styled } from "./style";

import { formatDate } from "@/formats/date";
import { PinchGestureHandler, State } from "react-native-gesture-handler";

interface PhotoPreviewProps {
  formCamera: Form<FormCamera>;
  form: Form<FoldersForm>;
  saveAction: Action<unknown>;
  onShare: () => void;
  onSave: () => void;
  onClosePreview: () => void;
  shareLoading: boolean;
  isPictureView: boolean;
}

export function PhotoPreview({
  formCamera,
  form,
  saveAction,
  onSave,
  onShare,
  shareLoading,
  isPictureView,
  onClosePreview,
}: PhotoPreviewProps) {
  const scale = new Animated.Value(1);
  const [isLoading, setIsLoading] = React.useState(
    !!(formCamera.value.selectedPicture?.uri || formCamera.value.photo?.uri)
  );

  const handlePinchGesture = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const handlePinchStateChange = (event: any) => {
    if (event.nativeEvent.state === State.END) {
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <KeyboardAvoidingView style={styled.container} behavior="padding">
      <Button
        disabled={saveAction.loading}
        style={styled.buttonClose}
        onPress={() => {
          isPictureView
            ? onClosePreview()
            : formCamera.setAll({
                photo: undefined,
                progress: 0,
              });
        }}
      >
        <IconX color={colors.gray[100]} size={18} />
      </Button>

      <View style={styled.imageContainer}>
        {isLoading && (
          <View style={styled.loadingContainer}>
            <ActivityIndicator size="large" color={colors.gray[100]} />
          </View>
        )}

        <PinchGestureHandler
          onGestureEvent={handlePinchGesture}
          onHandlerStateChange={handlePinchStateChange}
        >
          <Animated.Image
            style={[styled.preview, { transform: [{ scale }] }]}
            source={{
              uri: isPictureView
                ? formCamera.value.selectedPicture?.uri
                : formCamera.value.photo?.uri,
            }}
            onLoad={() => setIsLoading(false)}
          />
        </PinchGestureHandler>
      </View>

      <View
        style={{
          alignItems: isPictureView ? "flex-start" : "center",
          position: "relative",
          paddingTop: 24,
        }}
      >
        {!isPictureView && (
          <Input
            style={styled.input}
            placeholder="Descrição da foto"
            placeholderTextColor={colors.gray[400]}
            onChangeText={(v) => form.set("pictureDescription")(v)}
            value={form.value.pictureDescription}
          />
        )}

        {isPictureView && (
          <View style={styled.previewDescription}>
            <Text style={[styled.textPreview, { marginBottom: 8 }]}>
              {formCamera.value.selectedPicture?.description}
            </Text>
            <Text style={styled.textPreview}>
              {formatDate(formCamera.value.selectedPicture?.createdAt)}
            </Text>
          </View>
        )}
        <View style={styled.buttonContainer}>
          <Button
            onPress={onShare}
            style={styled.button}
            disabled={saveAction.loading || shareLoading}
          >
            {shareLoading ? (
              <ActivityIndicator size="small" color={colors.gray[100]} />
            ) : (
              <>
                <Button.Title style={styled.buttonText}>
                  Compartilhar
                </Button.Title>
                <Button.Icon icon={IconShare} />
              </>
            )}
          </Button>

          {!isPictureView && (
            <Button
              onPress={onSave}
              style={styled.button}
              disabled={saveAction.loading}
              isLoading={saveAction.loading}
            >
              <Button.Title style={styled.buttonText}>Salvar</Button.Title>
              <Button.Icon icon={IconSend2} />
            </Button>
          )}
        </View>
      </View>

      {formCamera.value.progress > 0 && (
        <View style={styled.circularLoadingContainer}>
          <CircularProgress progress={formCamera.value.progress} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
