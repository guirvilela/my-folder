import { updatePicuteDescription } from "@/services/folders";
import { ImageProp } from "@/services/folders/types";
import { uploadTakePicture } from "@/services/pictures";
import { useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useLocalSearchParams } from "expo-router";
import { shareAsync } from "expo-sharing";
import React, { useRef } from "react";
import { Alert } from "react-native";
import { FoldersForm } from "../details";
import { Form, useForm } from "../form";
import { useCustomAct } from "../http";

export interface FormCamera {
  camera: boolean;
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

  const handleSharePicture = () => {
    if (formCamera.value.photo?.uri) {
      shareAsync(formCamera.value.photo?.uri);
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
      });
    }
  }, [cameraRef, formCamera]);

  const handleSavePictureAction = useCustomAct(async () => {
    try {
      if (!formCamera.value.photo) {
        throw new Error("Nenhuma foto selecionada");
      }

      const fileName = formCamera.value.photo.uri.split("/").pop();

      const photoURL = await uploadTakePicture(
        formCamera.value.photo.uri,
        fileName,
        params.id
      );

      console.log("URL da foto salva:", photoURL);

      const imageData: ImageProp = {
        id: fileName,
        uri: photoURL,
        description: form.value.pictureDescription || "",
        createdAt: new Date().toISOString(),
      };

      const idToFetch = params.id[params.id.length - 1];
      await updatePicuteDescription(idToFetch, imageData);

      formCamera.setAll({
        photo: undefined,
        camera: false,
      });

      form.set("pictureDescription")("");

      onRefresh();

      return photoURL;
    } catch (error) {
      console.error("Erro ao salvar foto:", error);
      throw error;
    }
  });

  const handleUploadPictureAction = useCustomAct(async () => {
    try {
      const idToFetch = params.id[params.id.length - 1];

      // Verificar se o ID é válido
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

  return {
    formCamera,
    cameraRef,
    handleSavePictureAction,
    handleUploadPictureAction,
    handleTakePicture,
    handleSharePicture,
    handleOpenCamera,
  };
}
