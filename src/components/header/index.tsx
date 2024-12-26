import { colors } from "@/styles/colors";
import { IconArrowLeft, IconPlus } from "@tabler/icons-react-native";
import { router } from "expo-router";
import { Text, TouchableHighlight, View } from "react-native";
import { Button } from "../button";
import { styled } from "./styles";

interface HeaderProps {
  title?: string;
  isSubFolder: boolean;
  onOpenModalCreateFolder?: () => void;
}
export function Header({
  title,
  isSubFolder,
  onOpenModalCreateFolder,
}: HeaderProps) {
  return (
    <View>
      <View style={styled.arrow}>
        {isSubFolder && (
          <TouchableHighlight
            onPress={() => router.back()}
            underlayColor="transparent"
          >
            <IconArrowLeft size={26} color={colors.gray[300]} />
          </TouchableHighlight>
        )}
      </View>

      <View style={styled.container}>
        <Text style={styled.title}>{title || "Minhas pastas"}</Text>

        <Button
          style={{ padding: 10, height: 42 }}
          onPress={onOpenModalCreateFolder}
        >
          <Button.Icon icon={IconPlus} />
          <Button.Title>Pasta</Button.Title>
        </Button>
      </View>
    </View>
  );
}
