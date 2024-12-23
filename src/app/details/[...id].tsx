import { Folder } from "@/components/folder";
import { ModalFolderOptions } from "@/components/folder-options";
import { Header } from "@/components/header";
import { Image } from "@/components/image";
import { ModalCreateFolder } from "@/components/modal-folder";
import { useDetailsController } from "@/hooks/details";
import { ImageProp } from "@/services/folders/types";

import { IconFolderFilled } from "@tabler/icons-react-native";
import { router, usePathname } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

export default function FolderDetails() {
  const {
    form,
    formCreateFolder,
    onRefresh,
    createSubFolder,
    handleDeleteSubFolder,
  } = useDetailsController();

  const pathname = usePathname();

  const itemsToRender = React.useMemo(() => {
    if (!form.value.folder) return [];
    const { subfolders, images } = form.value.folder;

    return [
      ...(subfolders?.map((folder) => ({ ...folder, type: "folder" })) || []),
      ...(images?.map((image) => ({ ...image, type: "image" })) || []),
    ];
  }, [form.value.folder]);

  const handleNavigate = (subfolderId: string, currentPath: string) => {
    const newPath = `${currentPath}/${subfolderId}`;
    router.push(newPath);
  };

  const renderFolderItem = (folder: any, currentPath: string) => {
    return (
      <Folder
        icon={IconFolderFilled}
        description={folder.name}
        onNavigate={() => {
          handleNavigate(folder.id, currentPath);
        }}
        onLongPress={() =>
          form.setAll({
            modalOptions: true,
            selectedItem: folder,
          })
        }
      />
    );
  };

  return (
    <View style={{ flex: 1, padding: 24, gap: 12 }}>
      <Header
        isSubFolder
        title={form.value.folder?.name}
        onOpenModalCreateFolder={() =>
          formCreateFolder.set("modalCreate")(true)
        }
      />

      <FlatList
        data={itemsToRender}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 16,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "folder") {
            return renderFolderItem(item, pathname);
          } else if (item.type === "image") {
            return (
              <Image
                description={item.name}
                uri={(item as ImageProp).document}
              />
            );
          }

          return null;
        }}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        refreshControl={
          <RefreshControl
            refreshing={form.value.refresh}
            onRefresh={onRefresh}
          />
        }
      />

      <ModalCreateFolder form={formCreateFolder} onComplete={createSubFolder} />

      {form.value.modalOptions && (
        <ModalFolderOptions
          opened={form.value.modalOptions}
          name={form.value.selectedItem?.name ?? ""}
          onCloseOptions={() => form.set("modalOptions")(false)}
          onDelete={() => handleDeleteSubFolder(pathname)}
          isSubFolder
        />
      )}
    </View>
  );
}
