import {
  createNewSubFolder,
  deleteSubFolder,
  getFolderById,
} from "@/services/folders";
import { CreateFolderForm, FoldersResponse } from "@/services/folders/types";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { useForm } from "../form";

export interface FoldersForm {
  folder: FoldersResponse | undefined;
  refresh: boolean;
  modalOptions: boolean;
  selectedItem: FoldersResponse | undefined;
}

export function useDetailsController() {
  const params = useLocalSearchParams<{ id: string[] }>();

  const form = useForm<FoldersForm>({
    folder: undefined,
    refresh: false,
    modalOptions: false,
    selectedItem: undefined,
  });

  const formCreateFolder = useForm<CreateFolderForm>({
    nameFolder: "",
    modalCreate: false,
  });

  const getFolder = React.useCallback(async () => {
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

      const folderWithSubfolders = {
        ...data,
        subfolders: filteredSubfolders,
      };

      form.set("folder")(folderWithSubfolders);
    } catch (error) {
      console.error("Erro ao buscar pasta:", error);
    }
  }, [params.id, form]);

  const createSubFolder = React.useCallback(async () => {
    try {
      await createNewSubFolder(
        {
          images: [],
          name: formCreateFolder.value.nameFolder,
          subfolders: [],
        },
        params.id[params.id.length - 1]
      );
    } catch (error) {
      console.error("Erro ao criar a pasta principal:", error);
    } finally {
      formCreateFolder.reset();
      getFolder();
    }
  }, [formCreateFolder.value, params.id]);

  const handleDeleteSubFolder = async (parentId: string) => {
    const parentIdFormatted = parentId.split("/").pop();

    try {
      if (form.value.selectedItem && parentIdFormatted) {
        await deleteSubFolder(form.value.selectedItem.id, parentIdFormatted);
        console.log("Subpasta excluída com sucesso");
      }
    } catch (error) {
      console.error("Erro ao excluir a subpasta:", error);
    } finally {
      getFolder();
      form.set("modalOptions")(false);
    }
  };

  const onRefresh = async () => {
    form.set("refresh")(true);
    await getFolder();
    form.set("refresh")(false);
  };

  React.useEffect(() => {
    if (params.id.length) {
      getFolder();
    }
  }, [params.id]);

  return {
    form,
    formCreateFolder,
    createSubFolder,
    onRefresh,
    handleDeleteSubFolder,
  };
}
