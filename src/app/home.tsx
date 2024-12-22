import { Folder } from "@/components/folder";
import { Header } from "@/components/header";
import { ModalCreateFolder } from "@/components/modal-folder";
import { useHomeController } from "@/hooks/home";
import { IconFolderFilled } from "@tabler/icons-react-native";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

export default function Home() {
  const { form, formCreateFolder, createFolder, onRefresh } =
    useHomeController();

  return (
    <View style={{ flex: 1, padding: 24, gap: 24 }}>
      <Header
        onOpenModalCreateFolder={() =>
          formCreateFolder.set("modalCreate")(true)
        }
      />

      <FlatList
        data={form.value.folders.filter((folder) => !folder.parentId)}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Folder
            icon={IconFolderFilled}
            description={item.name}
            onNavigate={() =>
              router.push({
                pathname: "/details/[id]",
                params: { id: item.id },
              })
            }
            onDelete={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={form.value.refresh}
            onRefresh={onRefresh}
          />
        }
      />

      <ModalCreateFolder form={formCreateFolder} onComplete={createFolder} />
    </View>
  );
}
