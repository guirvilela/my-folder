import { Form } from "@/hooks/form";
import { FormCamera } from "@/hooks/picture";
import { colors } from "@/styles/colors";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Image as RNImage,
  Text,
  View,
} from "react-native";
import { Button } from "../button";
import { styled } from "./styles";

interface ModalImagesOptionsProps {
  formCamera: Form<FormCamera>;
  opened: boolean;
  loadingDelete: boolean;
  shareLoading: boolean;
  onDelete: () => void;
  onShare: () => void;
}

export function ModalImagesOptions({
  opened,
  formCamera,
  loadingDelete,
  shareLoading,
  onDelete,
  onShare,
}: ModalImagesOptionsProps) {
  const isLoadingDisabled = React.useMemo(
    () => loadingDelete || shareLoading,
    [loadingDelete, shareLoading]
  );

  return (
    <Modal visible={opened} animationType="fade" transparent={true}>
      <View style={styled.modalBackdrop}>
        <View style={styled.modalContainer}>
          <RNImage
            source={{ uri: formCamera.value.selectedPicture?.uri }}
            style={styled.image}
            resizeMode="cover"
          />

          <Text style={styled.textDescription}>
            {formCamera.value.selectedPicture?.description}
          </Text>

          <View style={styled.buttonContainer}>
            <Button
              variant="default"
              onPress={onShare}
              disabled={isLoadingDisabled}
            >
              {shareLoading ? (
                <ActivityIndicator size="small" color={colors.gray[100]} />
              ) : (
                <Button.Title variant="cancel">Compartilhar</Button.Title>
              )}
            </Button>

            <Button
              onPress={onDelete}
              disabled={isLoadingDisabled}
              variant="delete"
            >
              {loadingDelete ? (
                <ActivityIndicator size="small" color={colors.gray[100]} />
              ) : (
                <Button.Title> Excluir imagem</Button.Title>
              )}
            </Button>

            <Button
              onPress={() => formCamera.reset()}
              disabled={isLoadingDisabled}
              variant="cancel"
            >
              <Button.Title variant="cancel"> Cancelar</Button.Title>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
