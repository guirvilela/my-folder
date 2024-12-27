import {
  copyFolderStructure,
  createMainFolder,
  deleteMainFolder,
  getFolders,
  renameFolder,
} from "@/services/folders";
import {
  CreateFolderForm,
  FoldersResponse,
  RenameFolderForm,
} from "@/services/folders/types";
import React from "react";
import { Alert } from "react-native";
import { useForm } from "../form";
import { useCustomAct } from "../http";

interface FoldersForm {
  folders: FoldersResponse[];
  refresh: boolean;
  modalOptions: boolean;
  selectedItem: FoldersResponse | undefined;
  loading: boolean;
}

export function useHomeController() {
  const form = useForm<FoldersForm>({
    folders: [],
    refresh: false,
    modalOptions: false,
    selectedItem: undefined,
    loading: false,
  });

  const formCreateFolder = useForm<CreateFolderForm>({
    nameFolder: "",
    modalCreate: false,
  });

  const formRenameFolder = useForm<RenameFolderForm>({
    newName: "",
    rename: false,
  });

  const getAllFolders = useCustomAct(async () => {
    const data = await getFolders();

    form.set("folders")(data);
  });

  const createFolderAction = useCustomAct(async () => {
    if (!formCreateFolder.value.nameFolder) {
      throw new Error("Dados inválidos");
    }

    await createMainFolder({
      images: [],
      name: formCreateFolder.value.nameFolder,
      subfolders: [],
    });

    formCreateFolder.reset();
    await getAllFolders();
  });

  const handleCopyFolderAction = useCustomAct(async () => {
    if (!form.value.selectedItem?.id) {
      throw new Error("Dados inválidos");
    }

    const id = await copyFolderStructure(
      form.value.selectedItem?.id,
      formCreateFolder.value.nameFolder ?? "Nova pasta",
      null,
      true
    );

    form.reset();
    if (id) {
      await getAllFolders();
    }
  });

  const deleteMainFolderAction = useCustomAct(async () => {
    if (!form.value.selectedItem?.id) {
      throw new Error("Dados inválidos");
    }

    const id = await deleteMainFolder(form.value.selectedItem?.id);

    form.reset();
    if (id) {
      await getAllFolders();
    }
  });

  const handleQuestionDelete = React.useCallback(() => {
    Alert.alert(
      `Exclusão de pasta - ${form.value.selectedItem?.name}`,
      "Deseja realmente excluir essa pasta?",
      [
        { text: "Cancelar" },
        {
          text: "Excluir",
          onPress: () => deleteMainFolderAction(),
          style: "cancel",
        },
      ]
    );
  }, [form.value, deleteMainFolderAction]);

  const handleRenameAction = useCustomAct(async () => {
    if (!formRenameFolder.value.newName || !form.value.selectedItem?.id) {
      throw new Error("Dados inválidos");
    }

    const id = await renameFolder(
      form.value.selectedItem?.id,
      formRenameFolder.value.newName
    );

    form.reset();
    formRenameFolder.reset();
    if (id) {
      await getAllFolders();
    }
  });

  const onRefresh = async () => {
    form.set("refresh")(true);
    await getAllFolders();
    form.set("refresh")(false);
  };

  React.useEffect(() => {
    getAllFolders();
  }, []);

  return {
    form,
    formCreateFolder,
    formRenameFolder,
    getAllFolders,
    onRefresh,
    createFolderAction,
    deleteMainFolderAction,
    handleQuestionDelete,
    handleRenameAction,
    handleCopyFolderAction,
  };
}
