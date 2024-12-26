import {
  createNewSubFolder,
  deleteSubFolder,
  getFolderById,
  renameFolder,
} from "@/services/folders";
import {
  CreateFolderForm,
  FoldersResponse,
  RenameFolderForm,
} from "@/services/folders/types";
import { getFolderImages } from "@/services/pictures";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert } from "react-native";
import { useForm } from "../form";
import { useCustomAct } from "../http";

export interface FoldersForm {
  folder: FoldersResponse | undefined;
  refresh: boolean;
  modalOptions: boolean;
  selectedItem: FoldersResponse | undefined;
  loadingImages: boolean;
  pictureDescription: string;
}

export function useDetailsController() {
  const params = useLocalSearchParams<{ id: string[] }>();

  const form = useForm<FoldersForm>({
    folder: undefined,
    refresh: false,
    modalOptions: false,
    selectedItem: undefined,
    loadingImages: false,
    pictureDescription: "",
  });

  const formCreateFolder = useForm<CreateFolderForm>({
    nameFolder: "",
    modalCreate: false,
  });

  const formRenameFolder = useForm<RenameFolderForm>({
    newName: "",
    rename: false,
  });

  const getFolder = useCustomAct(async () => {
    const idToFetch = params.id[params.id.length - 1];

    try {
      const data = await getFolderById(idToFetch);

      if (!data) {
        console.error("Folder not found");
        return;
      }

      const subfolders = data.subfolders || [];

      const subfolderData = await Promise.all(
        subfolders.map((subfolderId) => getFolderById(String(subfolderId)))
      );

      const filteredSubfolders = subfolderData.filter(
        (subfolder) => subfolder !== null
      );

      const images = await getFolderImages(params.id);

      const imagesWithDescription = images.map((image) => {
        const matchedSubfolderImage = data.images.find(
          (subfolderImage) => subfolderImage.id === image.id
        );

        return {
          uri: image.url,
          description: matchedSubfolderImage
            ? matchedSubfolderImage.description
            : form.value.pictureDescription || "",
          createdAt: matchedSubfolderImage?.createdAt,
        };
      });

      const folderWithSubfolders = {
        ...data,
        images: imagesWithDescription,
        subfolders: filteredSubfolders,
      };

      form.set("folder")(folderWithSubfolders);
    } catch (error) {
      console.error("Erro ao buscar pasta:", error);
    }
  });

  const createSubFolderAction = useCustomAct(async () => {
    if (!formCreateFolder.value.nameFolder) {
      throw new Error("Dados inválidos");
    }

    await createNewSubFolder(
      {
        images: [],
        name: formCreateFolder.value.nameFolder,
        subfolders: [],
      },
      params.id[params.id.length - 1]
    );

    formCreateFolder.reset();
    await getFolder();
  });

  const deleteSubFolderAction = useCustomAct(async () => {
    const parentIdFormatted = params.id[params.id.length - 1];

    if (!form.value.selectedItem?.id || !parentIdFormatted) {
      throw new Error("Dados inválidos");
    }

    await deleteSubFolder(form.value.selectedItem.id, parentIdFormatted);
    await getFolder();
    form.set("modalOptions")(false);
  });

  const handleQuestionDelete = React.useCallback(() => {
    Alert.alert(
      `Exclusão de pasta - ${form.value.selectedItem?.name}`,
      "Deseja realmente excluir essa pasta?",
      [
        { text: "Cancelar" },
        {
          text: "Deletar",
          onPress: () => deleteSubFolderAction(),
          style: "cancel",
        },
      ]
    );
  }, [form.value, deleteSubFolderAction]);

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
      await getFolder();
    }
  });

  const onRefresh = async () => {
    form.set("refresh")(true);
    await getFolder();
    form.set("refresh")(false);
  };

  React.useEffect(() => {
    if (params.id) {
      getFolder();
    }
  }, []);

  return {
    getFolder,
    form,
    formCreateFolder,
    formRenameFolder,
    createSubFolderAction,
    deleteSubFolderAction,
    handleRenameAction,
    onRefresh,
    handleQuestionDelete,
  };
}
