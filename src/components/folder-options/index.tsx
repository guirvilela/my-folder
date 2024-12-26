import { Form } from "@/hooks/form";
import { RenameFolderForm } from "@/services/folders/types";
import { colors } from "@/styles/colors";
import { IconCheck, IconPencil, IconX } from "@tabler/icons-react-native";
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

interface ModalFolderOptionsProps {
  form: Form<RenameFolderForm>;
  name: string;
  opened: boolean;
  isSubFolder: boolean;
  loadingDelete: boolean;
  loadingCopyFolder?: boolean;
  onCloseOptions: () => void;
  onRename: () => void;
  onDelete: () => void;
  onCopy?: () => void;
}

export function ModalFolderOptions({
  opened,
  form,
  name,
  isSubFolder,
  loadingDelete,
  loadingCopyFolder,
  onRename,
  onCloseOptions,
  onCopy,
  onDelete,
}: ModalFolderOptionsProps) {
  const isLoadingDisabled = React.useMemo(
    () => loadingDelete || loadingCopyFolder,
    [loadingDelete, loadingCopyFolder]
  );

  return (
    <Modal visible={opened} animationType="fade" transparent={true}>
      <View style={styled.modalBackdrop}>
        <View style={styled.modalContainer}>
          {!form.value.rename ? (
            <View style={styled.titleContainer}>
              <Text style={styled.title}>{name}</Text>
              <IconPencil
                color={colors.gray[400]}
                onPress={() =>
                  form.setAll({
                    rename: true,
                    newName: name,
                  })
                }
              />
            </View>
          ) : (
            <View style={styled.renameContainer}>
              <Input
                onChangeText={(v) => form.set("newName")(v)}
                value={form.value.newName}
                placeholder="Digite o nome da pasta"
                style={styled.renameInput}
                autoFocus
              />
              <IconX
                color={colors.gray[400]}
                onPress={() =>
                  form.setAll({
                    rename: false,
                    newName: name,
                  })
                }
              />
              <IconCheck
                color={colors.green.base}
                onPress={() => {
                  form.reset(), onRename();
                }}
              />
            </View>
          )}

          <View style={styled.buttonContainer}>
            {!isSubFolder && (
              <TouchableOpacity
                style={styled.defaultButton}
                onPress={onCopy}
                disabled={isLoadingDisabled || form.value.rename}
              >
                {loadingCopyFolder ? (
                  <ActivityIndicator size="small" color={colors.gray[400]} />
                ) : (
                  <Text style={styled.buttonTextCancel}>Copiar pasta</Text>
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styled.buttonDelete}
              onPress={onDelete}
              disabled={isLoadingDisabled || form.value.rename}
            >
              {loadingDelete ? (
                <ActivityIndicator size="small" color={colors.gray[100]} />
              ) : (
                <Text style={styled.buttonText}>Excluir pasta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styled.button}
              onPress={() => {
                onCloseOptions();
                form.reset();
              }}
              disabled={isLoadingDisabled}
            >
              <Text style={styled.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
