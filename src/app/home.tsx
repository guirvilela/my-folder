import { EmptyFolder } from "@/components/empty-folders";
import { Folder } from "@/components/folder";
import { ModalFolderOptions } from "@/components/folder-options";
import { Header } from "@/components/header";
import { ModalCreateFolder } from "@/components/modal-folder";
import { Skeleton } from "@/components/skeleton";
import { useHomeController } from "@/hooks/home";
import { IconFolder } from "@tabler/icons-react-native";
import { router } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, View } from "react-native";

export default function Home() {
  const {
    form,
    formCreateFolder,
    formRenameFolder,
    createFolderAction,
    getAllFolders,
    onRefresh,
    deleteMainFolderAction,
    handleQuestionDelete,
    handleCopyFolderAction,
    handleRenameAction,
  } = useHomeController();

  const filteredFolders = React.useMemo(() => {
    return form.value.folders
      .filter((folder) => !folder.parentId)
      .sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);

        if (numA && numB) {
          return numA - numB; // Ordena por número se ambos possuem números
        }
        return a.name.localeCompare(b.name); // Ordena alfabeticamente caso contrário
      });
  }, [form.value.folders]);

  console.log(filteredFolders);

  return (
    <View style={{ flex: 1, padding: 24, gap: 24 }}>
      <Header
        isSubFolder={false}
        onOpenModalCreateFolder={() =>
          formCreateFolder.set("modalCreate")(true)
        }
      />

      {getAllFolders.loading ? (
        <FlatList
          data={Array.from({ length: 6 })}
          keyExtractor={(_, index) => `skeleton-${index}`}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
          }}
          renderItem={() => <Skeleton />}
          showsVerticalScrollIndicator={false}
        />
      ) : filteredFolders.length === 0 ? (
        <EmptyFolder />
      ) : (
        <FlatList
          data={filteredFolders}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: 14,
            marginBottom: 14,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Folder
              icon={IconFolder}
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
      )}

      <ModalCreateFolder
        form={formCreateFolder}
        onComplete={createFolderAction}
        loading={createFolderAction.loading}
      />

      {form.value.modalOptions && (
        <ModalFolderOptions
          form={formRenameFolder}
          opened={form.value.modalOptions}
          name={form.value.selectedItem?.name ?? ""}
          onCloseOptions={() => form.set("modalOptions")(false)}
          onDelete={handleQuestionDelete}
          onCopy={handleCopyFolderAction}
          loadingDelete={deleteMainFolderAction.loading}
          loadingCopyFolder={handleCopyFolderAction.loading}
          isSubFolder={false}
          onRename={handleRenameAction}
        />
      )}
    </View>
  );
}
