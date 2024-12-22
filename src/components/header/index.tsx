import { IconPlus } from "@tabler/icons-react-native";
import { Text, View } from "react-native";
import { Button } from "../button";
import { styled } from "./styles";

interface HeaderProps {
  title?: string;
  onOpenModalCreateFolder?: () => void;
}
export function Header({ title, onOpenModalCreateFolder }: HeaderProps) {
  return (
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
  );
}
