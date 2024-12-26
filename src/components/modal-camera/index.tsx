import { Form } from "@/hooks/form";
import { FormCamera } from "@/hooks/picture";
import { colors } from "@/styles/colors";
import { IconCamera, IconX } from "@tabler/icons-react-native";
import { CameraView } from "expo-camera";
import React, { Ref } from "react";
import { Modal, View } from "react-native";
import { Button } from "../button";
import { styled } from "./style";

interface ModalCameraProps {
  form: Form<FormCamera>;
  onTakePicture: () => void;
  cameraRef: Ref<CameraView>;
}

export const ModalCamera = ({
  form,
  cameraRef,
  onTakePicture,
}: ModalCameraProps) => {
  return (
    <Modal
      style={{ flex: 1 }}
      visible={form.value.camera}
      animationType="slide"
    >
      <Button
        style={styled.buttonClose}
        onPress={() => form.set("camera")(false)}
      >
        <IconX color={colors.gray[100]} size={18} />
      </Button>

      <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef} />

      <View style={styled.buttonTakePicture}>
        <Button onPress={onTakePicture} style={{ width: 120 }}>
          <Button.Icon icon={IconCamera} />
        </Button>
      </View>
    </Modal>
  );
};
