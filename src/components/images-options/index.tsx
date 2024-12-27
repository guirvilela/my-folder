import { Form } from "@/hooks/form";
import { FormCamera } from "@/hooks/picture";
import { colors } from "@/styles/colors";
import { IconPencil } from "@tabler/icons-react-native";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Image as RNImage,
  Text,
  View,
} from "react-native";
import { Button } from "../button";
import { Input } from "../input";
import { styled } from "./styles";

interface ModalImagesOptionsProps {
  formCamera: Form<FormCamera>;
  opened: boolean;
  loadingDelete: boolean;
  shareLoading: boolean;
  onDelete: () => void;
  onShare: () => void;
  onChangeDescription: () => void;
}

export function ModalImagesOptions({
  opened,
  formCamera,
  loadingDelete,
  shareLoading,
  onDelete,
  onShare,
  onChangeDescription,
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

          {!formCamera.value.changeDescription ? (
            <View style={styled.titleContainer}>
              <Text style={styled.textDescription}>
                {formCamera.value.selectedPicture?.description}
              </Text>
              <IconPencil
                color={colors.gray[400]}
                onPress={() =>
                  formCamera.setAll({
                    changeDescription: true,
                    newDescription:
                      formCamera.value.selectedPicture?.description || "",
                  })
                }
              />
            </View>
          ) : (
            <View style={styled.changeDescriptionContainer}>
              <Input
                onChangeText={(v) => formCamera.set("newDescription")(v)}
                value={formCamera.value.newDescription}
                placeholder="Digite o nome da pasta"
                style={styled.changeDescriptionInput}
                autoFocus
              />
            </View>
          )}

          <View style={styled.buttonContainer}>
            {!formCamera.value.changeDescription && (
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
            )}

            {formCamera.value.changeDescription ? (
              <Button
                onPress={onChangeDescription}
                disabled={isLoadingDisabled}
                variant="rename"
              >
                {loadingDelete ? (
                  <ActivityIndicator size="small" color={colors.gray[100]} />
                ) : (
                  <Button.Title>Alterar</Button.Title>
                )}
              </Button>
            ) : (
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
            )}

            <Button
              onPress={() =>
                formCamera.value.changeDescription
                  ? formCamera.setAll({
                      changeDescription: false,
                      newDescription: "",
                    })
                  : formCamera.reset()
              }
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
