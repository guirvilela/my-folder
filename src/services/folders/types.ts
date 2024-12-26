// Primeiro, defina a interface base para imagens
export interface ImageBase {
  id?: string;
  uri: string;
  description: string;
  createdAt?: string;
}

// Atualize a FoldersResponse para usar a ImageBase
export interface FoldersResponse {
  id: string;
  name: string;
  images: ImageBase[];
  subfolders: FoldersResponse[];
  parentId: string;
}

// ImageProp pode estender ImageBase se precisar de propriedades adicionais
export interface ImageProp extends ImageBase {
  name?: string;
}

// Resto das interfaces permanece igual
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
