import { Form } from "@/hooks/form";
import { RenameFolderForm } from "@/services/folders/types";
import { colors } from "@/styles/colors";
import { IconPencil } from "@tabler/icons-react-native";
import React from "react";
import { ActivityIndicator, Modal, Text, View } from "react-native";
import { Button } from "../button";
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
            </View>
          )}

          <View style={styled.buttonContainer}>
            {!isSubFolder && !form.value.rename && (
              <Button
                variant="default"
                onPress={onCopy}
                disabled={isLoadingDisabled || form.value.rename}
              >
                {loadingCopyFolder ? (
                  <ActivityIndicator size="small" color={colors.gray[400]} />
                ) : (
                  <Button.Title variant="default">Copiar pasta</Button.Title>
                )}
              </Button>
            )}

            {form.value.rename ? (
              <Button
                variant="rename"
                onPress={() => {
                  onRename();
                  form.reset();
                }}
              >
                <Button.Title>Renomear</Button.Title>
              </Button>
            ) : (
              <Button
                variant="delete"
                onPress={onDelete}
                disabled={isLoadingDisabled || form.value.rename}
              >
                {loadingDelete ? (
                  <ActivityIndicator size="small" color={colors.gray[100]} />
                ) : (
                  <Button.Title>Excluir pasta</Button.Title>
                )}
              </Button>
            )}

            <Button
              variant="cancel"
              onPress={() => {
                form.value.rename
                  ? form.setAll({
                      rename: false,
                      newName: name,
                    })
                  : (onCloseOptions(), form.reset());
              }}
              disabled={isLoadingDisabled}
            >
              <Button.Title variant="cancel">Cancelar</Button.Title>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
