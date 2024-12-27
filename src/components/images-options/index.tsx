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
  onDelete: () => void;
}

export function ModalImagesOptions({
  opened,
  formCamera,
  loadingDelete,
  onDelete,
}: ModalImagesOptionsProps) {
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
              onPress={onDelete}
              disabled={loadingDelete}
            >
              <Button.Title variant="cancel">Compartilhar</Button.Title>
            </Button>

            <Button
              onPress={onDelete}
              disabled={loadingDelete}
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
              disabled={loadingDelete}
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
