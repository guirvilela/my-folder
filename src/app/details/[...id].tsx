import { Button } from "@/components/button";
import { EmptyFolder } from "@/components/empty-folders";
import { Folder } from "@/components/folder";
import { ModalFolderOptions } from "@/components/folder-options";
import { Header } from "@/components/header";
import { Image } from "@/components/image";
import { ModalImagesOptions } from "@/components/images-options";
import { ModalCreateFolder } from "@/components/modal-folder";
import { PhotoPreview } from "@/components/photo-preview";
import { Skeleton } from "@/components/skeleton";
import { useDetailsController } from "@/hooks/details";
import { usePictureController } from "@/hooks/picture";
import { ImageBase } from "@/services/folders/types";

import { IconCamera, IconFolder, IconUpload } from "@tabler/icons-react-native";
import { router, usePathname } from "expo-router";
import React from "react";
import { FlatList, RefreshControl, StatusBar, View } from "react-native";

export default function FolderDetails() {
  const {
    getFolder,
    form,
    formCreateFolder,
    deleteSubFolderAction,
    onRefresh,
    createSubFolderAction,
    handleQuestionDelete,
    formRenameFolder,
    handleRenameAction,
  } = useDetailsController();

  const {
    formCamera,
    handleOpenCamera,
    handleSavePictureAction,
    handleUploadPictureAction,
    handleDeletePictureAction,
    handleQuestionDeleteImage,
    handleSharePicture,
    handleRenamePicutreDescription,
  } = usePictureController({ onRefresh, form });

  const pathname = usePathname();

  const itemsToRender = React.useMemo(() => {
    if (!form.value.folder) return [];
    const { subfolders, images } = form.value.folder;

    const sortedImages: ImageBase[] =
      images?.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : -Infinity;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : -Infinity;

        return dateB - dateA;
      }) || [];

    return [
      ...(subfolders?.map((folder) => ({ ...folder, type: "folder" })) || []),
      ...(sortedImages.map((image) => ({ image, type: "image" })) || []),
    ];
  }, [form.value.folder]);

  const handleNavigate = (subfolderId: string, currentPath: string) => {
    const newPath = `${currentPath}/${subfolderId}`;
    router.push(newPath);
  };

  const renderFolderItem = (folder: any, currentPath: string) => {
    return (
      <Folder
        icon={IconFolder}
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
    <View style={{ flex: 1, padding: 24, gap: 18 }}>
      <StatusBar barStyle="dark-content" />
      <Header
        isSubFolder
        title={form.value.folder?.name}
        onOpenModalCreateFolder={() =>
          formCreateFolder.set("modalCreate")(true)
        }
      />

      {getFolder.loading || form.value.loadingImages ? (
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
      ) : !itemsToRender.length ? (
        <EmptyFolder isSubFolders />
      ) : (
        <FlatList
          data={itemsToRender}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 16,
            paddingBottom: 8,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            if (item.type === "folder") {
              return renderFolderItem(item, pathname);
            }

            if (item.type === "image" && "image" in item) {
              const { uri, description, createdAt } = item.image;

              return (
                <Image
                  uri={uri}
                  onLoading={() => form.set("loadingImages")(true)}
                  onLoadEnd={() => form.set("loadingImages")(false)}
                  description={description}
                  createdAt={createdAt}
                  onPress={() =>
                    formCamera.setAll({
                      previewPicutre: true,
                      selectedPicture: {
                        uri,
                        description,
                        createdAt,
                      } as Partial<ImageBase>,
                    })
                  }
                  onLongPress={() =>
                    formCamera.setAll({
                      modalOptionsPicture: true,
                      selectedPicture: {
                        uri,
                        description,
                        createdAt,
                      } as Partial<ImageBase>,
                    })
                  }
                />
              );
            }

            return null;
          }}
          keyExtractor={(item, index) => `${item.type}-${index}`}
          refreshControl={
            <RefreshControl
              refreshing={form.value.refresh}
              onRefresh={onRefresh}
            />
          }
        />
      )}

      <View style={{ flexDirection: "row", gap: 8 }}>
        <Button
          style={{ flex: 1, alignItems: "center" }}
          onPress={handleUploadPictureAction}
        >
          <Button.Title style={{ marginTop: 2 }}>Upload</Button.Title>
          <Button.Icon icon={IconUpload} />
        </Button>

        <Button
          style={{ flex: 1, alignItems: "center" }}
          onPress={handleOpenCamera}
        >
          <Button.Title style={{ marginTop: 2 }}>Tirar foto</Button.Title>
          <Button.Icon icon={IconCamera} />
        </Button>
      </View>

      {(formCamera.value.photo || formCamera.value.previewPicutre) && (
        <PhotoPreview
          formCamera={formCamera}
          form={form}
          onSave={handleSavePictureAction}
          onShare={handleSharePicture}
          saveAction={handleSavePictureAction}
          shareLoading={handleSharePicture.loading}
          isPictureView={formCamera.value.previewPicutre}
          onClosePreview={() => formCamera.reset()}
        />
      )}

      <ModalCreateFolder
        form={formCreateFolder}
        onComplete={createSubFolderAction}
        loading={createSubFolderAction.loading}
      />

      {formCamera.value.modalOptionsPicture && (
        <ModalImagesOptions
          opened={formCamera.value.modalOptionsPicture}
          formCamera={formCamera}
          loadingDelete={handleDeletePictureAction.loading}
          onDelete={handleQuestionDeleteImage}
          onShare={handleSharePicture}
          onChangeDescription={handleRenamePicutreDescription}
          shareLoading={handleSharePicture.loading}
        />
      )}

      {form.value.modalOptions && (
        <ModalFolderOptions
          opened={form.value.modalOptions}
          form={formRenameFolder}
          name={form.value.selectedItem?.name ?? ""}
          onCloseOptions={() => form.set("modalOptions")(false)}
          onDelete={handleQuestionDelete}
          isSubFolder
          loadingDelete={deleteSubFolderAction.loading}
          onRename={handleRenameAction}
        />
      )}
    </View>
  );
}
