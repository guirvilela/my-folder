export interface ImageBase {
  id?: string;
  uri: string;
  description: string;
  createdAt?: string;
}

export interface FoldersResponse {
  id: string;
  name: string;
  images: ImageBase[];
  subfolders: FoldersResponse[];
  parentId: string;
}

export interface ImageProp extends ImageBase {
  name?: string;
}

export interface FoldersRequest {
  name: string;
  images: ImageProp[];
  subfolders: FoldersResponse[];
}

export interface CreateFolderForm {
  nameFolder: string;
  modalCreate: boolean;
}

export interface RenameFolderForm {
  newName: string;
  rename: boolean;
}

export interface ImageFormattedProps {
  image: {
    createdAt: string;
    description: string;
    uri: string;
  };
  type: string;
}
