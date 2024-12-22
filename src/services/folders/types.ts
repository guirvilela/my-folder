export interface FoldersResponse {
  id: string;
  name: string;
  images: ImageProp[];
  subfolders: FoldersResponse[];
  parentId: string;
}

export interface ImageProp {
  id: string;
  document: string;
  name: string;
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
