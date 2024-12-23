import { Folder } from "@/components/folder";
import { ModalFolderOptions } from "@/components/folder-options";
import { Header } from "@/components/header";
import { ModalCreateFolder } from "@/components/modal-folder";
import { useHomeController } from "@/hooks/home";
import { IconFolderFilled } from "@tabler/icons-react-native";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

export default function Home() {
  const {
    form,
    formCreateFolder,
    createFolder,
    onRefresh,
    handleDeleteMainFolder,
    handleCopyFolderStructure,
  } = useHomeController();

  return (
    <View style={{ flex: 1, padding: 24, gap: 24 }}>
      <Header
        isSubFolder={false}
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
            onLongPress={() =>
              form.setAll({
                modalOptions: true,
                selectedItem: item,
              })
            }
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

      {form.value.modalOptions && (
        <ModalFolderOptions
          opened={form.value.modalOptions}
          name={form.value.selectedItem?.name ?? ""}
          onCloseOptions={() => form.set("modalOptions")(false)}
          onDelete={handleDeleteMainFolder}
          onCopy={handleCopyFolderStructure}
          isSubFolder={false}
        />
      )}
    </View>
  );
}
