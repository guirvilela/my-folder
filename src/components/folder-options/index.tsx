import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { styled } from "./styles";

interface ModalFolderOptionsProps {
  name: string;
  opened: boolean;
  isSubFolder: boolean;
  onCloseOptions: () => void;
  onDelete: () => void;
  onCopy?: () => void;
}

export function ModalFolderOptions({
  opened,
  name,
  isSubFolder,
  onCloseOptions,
  onCopy,
  onDelete,
}: ModalFolderOptionsProps) {
  return (
    <Modal visible={opened} animationType="fade" transparent={true}>
      <View style={styled.modalBackdrop}>
        <View style={styled.modalContainer}>
          <Text style={styled.title}>{name}</Text>

          <View style={styled.buttonContainer}>
            {!isSubFolder && (
              <TouchableOpacity style={styled.defaultButton} onPress={onCopy}>
                <Text style={styled.buttonTextCancel}>Copiar pasta</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styled.buttonDelete} onPress={onDelete}>
              <Text style={styled.buttonText}>Excluir pasta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styled.button} onPress={onCloseOptions}>
              <Text style={styled.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
