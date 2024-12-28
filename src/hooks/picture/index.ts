import {
  renamePicuteDescription,
  updatePicuteDescription,
} from "@/services/folders";
import { ImageBase, ImageProp } from "@/services/folders/types";
import { deleteImage, uploadTakePicture } from "@/services/pictures";
import { Photo } from "@/services/pictures/types";
import { useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Alert, Keyboard, Platform, Share } from "react-native";
import { FoldersForm } from "../details";
import { Form, useForm } from "../form";
import { useCustomAct } from "../http";

export interface FormCamera {
  progress: number;
  photo: Photo | undefined;
  selectedPicture: Partial<ImageBase> | undefined;
  modalOptionsPicture: boolean;
  newDescription: string;
  changeDescription: boolean;
  previewPicutre: boolean;
}

interface usePictureController {
  onRefresh: () => void;
  form: Form<FoldersForm>;
}

export function usePictureController({
  onRefresh,
  form,
}: usePictureController) {
  const [_, requestPermission] = useCameraPermissions();

  const params = useLocalSearchParams<{ id: string[] }>();

  const formCamera = useForm<FormCamera>({
    photo: undefined,
    progress: 0,
    selectedPicture: undefined,
    modalOptionsPicture: false,
    newDescription: "",
    changeDescription: false,
    previewPicutre: false,
  });

  const handleSharePicture = useCustomAct(async () => {
    try {
      const description = formCamera.value.photo?.uri
        ? form.value.pictureDescription
        : formCamera.value.selectedPicture?.description || "";

      if (formCamera.value.photo?.uri) {
        const shareOptions = {
          message: description,
          ...(Platform.OS === "ios"
            ? { url: formCamera.value.photo.uri }
            : { files: [formCamera.value.photo.uri] }),
        };
        await Share.share(shareOptions);
      } else if (formCamera.value.selectedPicture?.uri) {
        const fileExtension = formCamera.value.selectedPicture.uri
          .split(".")
          .pop();
        const localFileName = `temp_image_${Date.now()}.${fileExtension}`;
        const localFilePath = `${FileSystem.cacheDirectory}${localFileName}`;

        const downloadResult = await FileSystem.downloadAsync(
          formCamera.value.selectedPicture.uri,
          localFilePath
        );

        if (downloadResult.status === 200) {
          const shareOptions = {
            message: description,
            ...(Platform.OS === "ios"
              ? { url: downloadResult.uri }
              : { files: [downloadResult.uri] }),
          };
          await Share.share(shareOptions);

          await FileSystem.deleteAsync(localFilePath, { idempotent: true });
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  });

  const handleOpenCamera = React.useCallback(async () => {
    const { granted } = await requestPermission();
    const library = await MediaLibrary.requestPermissionsAsync();
    const mediaLibraryPermission = library.status === "granted";

    try {
      if (!granted && !mediaLibraryPermission) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }
    } catch (error) {
      Alert.alert("Câmera", "Não foi possível utilizar a câmera");
    } finally {
      handleTakePicture();
    }
  }, [formCamera.value]);

  const handleTakePicture = React.useCallback(async () => {
    const cameraResp = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      exif: true,
    });

    if (cameraResp.assets) {
      const { uri } = cameraResp.assets[0];

      formCamera.setAll({
        photo: { uri },
        progress: 0,
      });
    }
  }, [formCamera]);

  const handleSavePictureAction = useCustomAct(async () => {
    Keyboard.dismiss();
    try {
      if (!formCamera.value.photo) {
        throw new Error("Nenhuma foto selecionada");
      }

      const fileName = formCamera.value.photo.uri.split("/").pop();

      const photoURL = await uploadTakePicture(
        formCamera.value.photo.uri,
        fileName,
        params.id,
        (progress) => formCamera.set("progress")(progress)
      );

      const imageData: ImageProp = {
        id: fileName,
        uri: photoURL,
        description: form.value.pictureDescription || "",
        createdAt: new Date().toISOString(),
      };

      const idToFetch = params.id[params.id.length - 1];
      await updatePicuteDescription(idToFetch, imageData);

      if (photoURL) {
        onRefresh();
      }
      return photoURL;
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      throw error;
    }
  });

  const handleUploadPictureAction = useCustomAct(async () => {
    try {
      const idToFetch = params.id[params.id.length - 1];

      if (!idToFetch) {
        throw new Error("ID inválido");
      }

      const cameraResp = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
        exif: true,
      });

      if (!cameraResp.canceled && cameraResp.assets && cameraResp.assets[0]) {
        const { uri } = cameraResp.assets[0];

        formCamera.setAll({
          photo: {
            uri,
          },
        });
      }
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw error;
    }
  });

  const handleQuestionDeleteImage = React.useCallback(() => {
    Alert.alert(`Exclusão de foto`, "Deseja realmente excluir essa foto?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: () => handleDeletePictureAction(),
        style: "cancel",
      },
    ]);
  }, [formCamera.value]);

  const handleDeletePictureAction = useCustomAct(async () => {
    Keyboard.dismiss();
    try {
      if (!formCamera.value.selectedPicture?.uri) {
        throw new Error("Nenhuma foto selecionada");
      }

      const decodedUri = decodeURIComponent(
        formCamera.value.selectedPicture.uri
      );

      const fileName = decodedUri.split("/").pop();

      const idImage = fileName?.split("?")[0];

      if (!idImage) {
        throw new Error("Erro ao encontrar image");
      }

      const imageDeleted = await deleteImage(params.id, idImage);

      if (imageDeleted) {
        formCamera.reset(), onRefresh();
      }
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      throw error;
    }
  });

  const handleRenamePicutreDescription = useCustomAct(async () => {
    if (!formCamera.value.selectedPicture?.uri) {
      throw new Error("Nenhuma foto selecionada");
    }

    const decodedUri = decodeURIComponent(formCamera.value.selectedPicture.uri);

    const fileName = decodedUri.split("/").pop();
    const idImage = fileName?.split("?")[0];

    if (!idImage) {
      throw new Error("Erro ao encontrar a imagem");
    }

    const folderId = params.id[params.id.length - 1];

    try {
      const updatedFolderId = await renamePicuteDescription(
        folderId,
        idImage,
        formCamera.value.newDescription
      );

      if (updatedFolderId) {
        formCamera.reset();
        onRefresh();
      }
    } catch (error) {
      console.error("Erro ao renomear descrição:", error);
    }
  });

  React.useEffect(() => {
    if (formCamera.value.progress >= 100) {
      formCamera.setAll({
        photo: undefined,
        progress: 0,
      });
      form.set("pictureDescription")("");
    }
  }, [formCamera.value.progress]);

  return {
    formCamera,
    handleSavePictureAction,
    handleUploadPictureAction,
    handleDeletePictureAction,
    handleQuestionDeleteImage,
    handleSharePicture,
    handleOpenCamera,
    handleRenamePicutreDescription,
  };
}
