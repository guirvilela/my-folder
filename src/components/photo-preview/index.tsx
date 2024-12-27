import { FoldersForm } from "@/hooks/details";
import { Form } from "@/hooks/form";
import { Action } from "@/hooks/http";
import { FormCamera } from "@/hooks/picture";
import { colors } from "@/styles/colors";
import { IconSend2, IconShare, IconX } from "@tabler/icons-react-native";
import { Image, KeyboardAvoidingView, View } from "react-native";
import { Button } from "../button";
import { Input } from "../input";
import { CircularProgress } from "../loadingProgress";
import { styled } from "./style";

interface PhotoPreviewProps {
  formCamera: Form<FormCamera>;
  form: Form<FoldersForm>;
  saveAction: Action<unknown>;
  onShare: () => void;
  onSave: () => void;
}

export function PhotoPreview({
  formCamera,
  form,
  saveAction,
  onSave,
  onShare,
}: PhotoPreviewProps) {
  return (
    <KeyboardAvoidingView style={styled.container} behavior="padding">
      {/* <SafeAreaView> */}
      <Button
        disabled={saveAction.loading}
        style={styled.buttonClose}
        onPress={() => {
          formCamera.setAll({
            photo: undefined,
            camera: true,
            progress: 0,
          });
        }}
      >
        <IconX color={colors.gray[100]} size={18} />
      </Button>

      <View style={{ flex: 1, width: "100%" }}>
        <Image
          style={styled.preview}
          source={{
            uri: `data:image/jpg;base64,${formCamera.value.photo?.base64}`,
          }}
        />
      </View>

      <View style={{ alignItems: "center", position: "relative" }}>
        <Input
          style={styled.input}
          placeholder="Descrição da foto"
          placeholderTextColor={colors.gray[400]}
          onChangeText={(v) => form.set("pictureDescription")(v)}
          value={form.value.pictureDescription}
        />

        <View style={styled.buttonContainer}>
          <Button
            onPress={onShare}
            style={styled.button}
            disabled={saveAction.loading}
          >
            <Button.Title style={styled.buttonText}>Compartilhar</Button.Title>
            <Button.Icon icon={IconShare} />
          </Button>

          <Button
            onPress={onSave}
            style={styled.button}
            disabled={saveAction.loading}
            isLoading={saveAction.loading}
          >
            <Button.Title style={styled.buttonText}>Salvar</Button.Title>
            <Button.Icon icon={IconSend2} />
          </Button>
        </View>
      </View>

      {formCamera.value.progress > 0 && (
        <View style={styled.circularLoadingContainer}>
          <CircularProgress progress={formCamera.value.progress} />
        </View>
      )}
      {/* </SafeAreaView> */}
    </KeyboardAvoidingView>
  );
}
