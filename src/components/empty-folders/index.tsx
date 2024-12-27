import { colors } from "@/styles/colors";
import { IconFoldersOff } from "@tabler/icons-react-native";
import { Text, View } from "react-native";
import { styled } from "./styles";

interface EmptyFolderProps {
  isSubFolders?: boolean;
}

export function EmptyFolder({ isSubFolders }: EmptyFolderProps) {
  return (
    <View style={styled.container}>
      <IconFoldersOff color={colors.gray[500]} size={80} fill="transparent" />

      <Text style={styled.textEmpty}>
        {!isSubFolders
          ? "Nenhuma pasta encontrada.\nCrie uma nova pasta para começar."
          : "Nenhuma pasta encontrada.\nCrie uma nova pasta, envie arquivos ou capture fotos para começar."}
      </Text>
    </View>
  );
}
