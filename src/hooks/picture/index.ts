import { updatePicuteDescription } from "@/services/folders";
import { ImageBase, ImageProp } from "@/services/folders/types";
import { deleteImage, uploadTakePicture } from "@/services/pictures";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import React, { useRef } from "react";
import { Alert, Keyboard, Share } from "react-native";
import { FoldersForm } from "../details";
import { Form, useForm } from "../form";
import { useCustomAct } from "../http";

export interface FormCamera {
  camera: boolean;
  progress: number;
  photo:
    | {
        base64: string;
        exif?: {
          ImageLength: number;
          ImageWidth: number;
          LightSource: number;
          Orientation: number;
          [key: string]: any;
        };
        height: number;
        uri: string;
        width: number;
      }
    | undefined;
  selectedPicture: Partial<ImageBase> | undefined;
  modalOptionsPicture: boolean;
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
  const cameraRef = useRef<any>(null);

  const params = useLocalSearchParams<{ id: string[] }>();

  const formCamera = useForm<FormCamera>({
    camera: false,
    photo: undefined,
    progress: 0,
    selectedPicture: undefined,
    modalOptionsPicture: false,
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
      formCamera.set("camera")(true);
    }
  }, [formCamera.value]);

  const handleSharePicture = async () => {
    try {
      if (formCamera.value.photo?.uri) {
        const description = form.value.pictureDescription || "";

        const result = await Share.share({
          message: description,
          url: formCamera.value.photo?.uri,
        });

        if (result.action === Share.sharedAction) {
          console.log("Imagem e texto compartilhados com sucesso.");
        } else if (result.action === Share.dismissedAction) {
          console.log("O compartilhamento foi cancelado.");
        }
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  };

  const handleTakePicture = React.useCallback(async () => {
    const options = {
      quality: 1,
      base64: true,
      exif: true,
    };

    if (cameraRef.current) {
      const newPhoto = await cameraRef.current.takePictureAsync(options);
      formCamera.setAll({
        photo: newPhoto,
        camera: false,
        progress: 0,
      });
    }
  }, [cameraRef, formCamera]);

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

      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!cameraResp.canceled && cameraResp.assets && cameraResp.assets[0]) {
        const { uri } = cameraResp.assets[0];

        const fileName = uri.split("/").pop();

        // const uploadResponse = await uploadTakePicture(
        //   uri,
        //   fileName,
        //   idToFetch
        // );
        // console.log("Upload bem-sucedido:", uploadResponse);
      }
    } catch (error) {
      console.error("Erro ", error);
      // Aqui você pode adicionar um toast ou alert para o usuário
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

  React.useEffect(() => {
    if (formCamera.value.progress >= 100) {
      formCamera.setAll({
        photo: undefined,
        camera: false,
        progress: 0,
      });
      form.set("pictureDescription")("");

      onRefresh();
    }
  }, [formCamera.value.progress]);

  return {
    formCamera,
    cameraRef,
    handleSavePictureAction,
    handleUploadPictureAction,
    handleDeletePictureAction,
    handleQuestionDeleteImage,
    handleTakePicture,
    handleSharePicture,
    handleOpenCamera,
  };
}
