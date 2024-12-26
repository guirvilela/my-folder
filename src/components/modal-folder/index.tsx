import { Form } from "@/hooks/form";
import { CreateFolderForm } from "@/services/folders/types";
import { colors } from "@/styles/colors";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Input } from "../input";
import { styled } from "./styles";

interface ModalCreateFolderProps {
  form: Form<CreateFolderForm>;
  loading: boolean;
  onComplete: () => void;
}

export function ModalCreateFolder({
  form,
  loading,
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
            autoFocus
          />

          <View style={styled.buttonContainer}>
            <TouchableOpacity
              style={styled.buttonCancel}
              onPress={() => form.reset()}
            >
              <Text style={styled.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styled.button}
              onPress={onComplete}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.gray[100]} />
              ) : (
                <Text style={styled.buttonText}>Criar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
