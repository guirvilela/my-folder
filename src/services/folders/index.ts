import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebaseConfig";
import { FoldersRequest, FoldersResponse, ImageProp } from "./types";

export async function getFolders(): Promise<FoldersResponse[]> {
  try {
    const foldersCollection = collection(firestore, "folders");
    const snapshot = await getDocs(foldersCollection);

    const folders: FoldersResponse[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;

      return {
        id: doc.id,
        name: data.name,
        images: data.images || [],
        subfolders: data.subfolders || [],
        parentId: data.parentId,
      };
    });

    return folders;
  } catch (error) {
    return [];
  }
}

export async function getFolderById(
  id: string
): Promise<FoldersResponse | null> {
  try {
    const folderDocRef = doc(firestore, "folders", id);
    const docSnapshot = await getDoc(folderDocRef);

    if (docSnapshot.exists()) {
      const folderData = docSnapshot.data() as FoldersResponse;
      return folderData;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export async function createMainFolder(folder: FoldersRequest) {
  try {
    const foldersCollection = collection(firestore, "folders");

    const folderData = {
      name: folder.name,
      images: folder.images || [],
      parentId: null,
      subfolders: [],
    };

    const docRef = await addDoc(foldersCollection, folderData);

    return docRef.id;
  } catch (error) {
    throw error;
  }
}

export async function createNewSubFolder(
  folder: FoldersRequest,
  parentId: string
) {
  try {
    const foldersCollection = collection(firestore, "folders");

    const folderData = {
      name: folder.name,
      images: [],
      parentId,
    };

    const folderRef = doc(foldersCollection);
    await setDoc(folderRef, { ...folderData, id: folderRef.id });

    const mainFolderRef = doc(foldersCollection, parentId);
    await updateDoc(mainFolderRef, {
      subfolders: arrayUnion(folderRef.id),
    });

    return folderRef.id;
  } catch (error) {
    throw error;
  }
}

export async function deleteMainFolder(folderId: string) {
  try {
    const foldersCollection = collection(firestore, "folders");
    const folderRef = doc(foldersCollection, folderId);

    const folderSnapshot = await getDoc(folderRef);
    const folderData = folderSnapshot.data();

    if (!folderSnapshot.exists() || !folderData) {
      return;
    }

    const subfolders = folderData.subfolders || [];
    for (const subfolderId of subfolders) {
      await deleteMainFolder(subfolderId);
    }

    await deleteDoc(folderRef);
    return folderRef.id;
  } catch (error) {
    throw error;
  }
}

export async function deleteSubFolder(folderId: string, parentId: string) {
  try {
    const foldersCollection = collection(firestore, "folders");

    const parentFolderRef = doc(foldersCollection, parentId);

    await updateDoc(parentFolderRef, {
      subfolders: arrayRemove(folderId),
    });

    const folderRef = doc(foldersCollection, folderId);
    await deleteDoc(folderRef);
  } catch (error) {
    throw error;
  }
}

export const copyFolderStructure = async (
  folderId?: string | null,
  folderName?: string,
  newParentId: string | null = null,
  isMainFolder?: boolean
) => {
  try {
    const foldersCollection = collection(firestore, "folders");

    // Caso a pasta não exista, cria uma nova pasta principal
    if (!folderId) {
      const newFolderRef = await addDoc(foldersCollection, {
        name: folderName,
        parentId: null,
        subfolders: [],
      });

      console.log(`Nova pasta principal criada: ${newFolderRef.id}`);
      return newFolderRef.id;
    }

    const folderRef = doc(foldersCollection, folderId);
    const folderSnapshot = await getDoc(folderRef);

    if (!folderSnapshot.exists()) {
      console.error(`A pasta com ID ${folderId} não existe!`);
      return null;
    }

    const folderData = folderSnapshot.data();
    const { name, subfolders, ...restData } = folderData;

    // Se for a pasta principal, adiciona o sufixo '- cópia'
    const newFolderName = isMainFolder ? `${name} - cópia` : name;

    const newFolderRef = await addDoc(foldersCollection, {
      ...restData,
      name: newFolderName,
      parentId: newParentId, // Certificando-se de que o parentId está correto
      subfolders: [], // Inicializa as subpastas como vazias por enquanto
    });

    console.log(`Nova pasta criada: ${newFolderRef.id} (cópia de ${folderId})`);

    const newSubfolderIds: string[] = [];
    for (const subfolderId of subfolders || []) {
      // Recursivamente copia as subpastas, passando o ID da nova pasta como novo parentId
      const newSubfolderId = await copyFolderStructure(
        subfolderId,
        undefined,
        newFolderRef.id, // Aqui passa o ID da pasta recém-criada como novo parentId
        false // Passa false para não adicionar sufixo nas subpastas
      );
      if (newSubfolderId) {
        newSubfolderIds.push(newSubfolderId);
      }
    }

    // Atualiza a nova pasta com as subpastas copiadas
    await updateDoc(newFolderRef, { subfolders: newSubfolderIds });

    return newFolderRef.id;
  } catch (error) {
    console.error("Erro ao copiar a estrutura de pastas:", error);
    throw error;
  }
};

export async function renameFolder(folderId: string, newName: string) {
  try {
    const foldersCollection = collection(firestore, "folders");

    const folderRef = doc(foldersCollection, folderId);

    await updateDoc(folderRef, {
      name: newName,
    });

    console.log(`Pasta renomeada para "${newName}" com sucesso.`);
    return folderId;
  } catch (error) {
    console.error("Erro ao renomear a pasta:", error);
    throw error;
  }
}

export async function updatePicuteDescription(
  folderId: string,
  imageData: ImageProp
) {
  try {
    const foldersCollection = collection(firestore, "folders");

    const folderRef = doc(foldersCollection, folderId);

    await updateDoc(folderRef, {
      images: arrayUnion(imageData),
    });

    return folderId;
  } catch (error) {
    console.error("Erro ao fazer update", error);
    return [];
  }
}

export async function renamePicuteDescription(
  folderId: string,
  imageId: string,
  newDescription: string
) {
  try {
    const foldersCollection = collection(firestore, "folders");
    const folderRef = doc(foldersCollection, folderId);

    // Obter o documento atual para localizar o array de imagens
    const folderSnapshot = await getDoc(folderRef);
    if (!folderSnapshot.exists()) {
      throw new Error("Pasta não encontrada");
    }

    const folderData = folderSnapshot.data();
    const images = folderData.images || [];

    // Atualizar a descrição da imagem correspondente no array
    const updatedImages = images.map((image: any) =>
      image.id === imageId ? { ...image, description: newDescription } : image
    );

    // Atualizar o documento no Firestore
    await updateDoc(folderRef, { images: updatedImages });

    return folderId;
  } catch (error) {
    console.error("Erro ao fazer update no Firestore:", error);
    throw error;
  }
}
