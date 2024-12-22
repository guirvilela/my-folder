import { Form } from "@/hooks/form";
import { CreateFolderForm } from "@/services/folders/types";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../input";
import { styled } from "./styles";

interface ModalCreateFolderProps {
  form: Form<CreateFolderForm>;
  onComplete: () => void;
}

export function ModalCreateFolder({
  form,
  onComplete,
}: ModalCreateFolderProps) {
  return (
    <Modal
      visible={form.value.modalCreate}
      animationType="fade"
      transparent={true}
    >
      <View style={styled.modalBackdrop}>
        <View style={styled.modalContainer}>
          <Text style={styled.title}>Criar nova pasta</Text>

          <Input
            placeholder="Nome da pasta"
            value={form.value.nameFolder}
            onChangeText={(v) => form.set("nameFolder")(v)}
          />

          <View style={styled.buttonContainer}>
            <TouchableOpacity
              style={styled.buttonCancel}
              onPress={() => form.set("modalCreate")(false)}
            >
              <Text style={styled.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styled.button} onPress={onComplete}>
              <Text style={styled.buttonText}>Criar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
