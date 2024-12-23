import {
  copyFolderStructure,
  createMainFolder,
  deleteMainFolder,
  getFolders,
} from "@/services/folders";
import { CreateFolderForm, FoldersResponse } from "@/services/folders/types";
import React from "react";
import { useForm } from "../form";

interface FoldersForm {
  folders: FoldersResponse[];
  refresh: boolean;
  modalOptions: boolean;
  selectedItem: FoldersResponse | undefined;
}

export function useHomeController() {
  const form = useForm<FoldersForm>({
    folders: [],
    refresh: false,
    modalOptions: false,
    selectedItem: undefined,
  });

  const formCreateFolder = useForm<CreateFolderForm>({
    nameFolder: "",
    modalCreate: false,
  });

  const getAllFolders = React.useCallback(async () => {
    const data = await getFolders();

    form.set("folders")(data);
  }, [form]);

  const createFolder = React.useCallback(async () => {
    try {
      await createMainFolder({
        images: [],
        name: formCreateFolder.value.nameFolder,
        subfolders: [],
      });
    } catch (error) {
      console.error("Erro ao criar a pasta principal:", error);
    } finally {
      formCreateFolder.reset();
      getAllFolders();
    }
  }, [formCreateFolder.value]);

  const handleCopyFolderStructure = React.useCallback(async () => {
    const data = await copyFolderStructure(
      form.value.selectedItem?.id,
      formCreateFolder.value.nameFolder
    );

    form.reset(["folders"]);
    getAllFolders();
  }, [form.value, formCreateFolder.value]);

  const handleDeleteMainFolder = React.useCallback(async () => {
    try {
      if (!form.value.selectedItem?.id) {
        return;
      }

      await deleteMainFolder(form.value.selectedItem?.id);
    } catch (error) {
    } finally {
      getAllFolders();
      form.reset();
    }
  }, [form.value]);

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
    onRefresh,
    createFolder,
    handleDeleteMainFolder,
    handleCopyFolderStructure,
  };
}
