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
import { FoldersRequest, FoldersResponse } from "./types";

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
  newParentId: string | null = null
) => {
  try {
    const foldersCollection = collection(firestore, "folders");

    // Caso esteja criando uma nova pasta principal (sem copiar)
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
    const newFolderRef = await addDoc(foldersCollection, {
      ...restData,
      name: name,
      parentId: newParentId,
      subfolders: [],
    });

    console.log(`Nova pasta criada: ${newFolderRef.id} (cópia de ${folderId})`);

    // Copiar subpastas da pasta original
    const newSubfolderIds: string[] = [];
    for (const subfolderId of subfolders || []) {
      const newSubfolderId = await copyFolderStructure(
        subfolderId,
        undefined,
        newFolderRef.id
      ); // Chamada recursiva
      if (newSubfolderId) {
        newSubfolderIds.push(newSubfolderId); // Adiciona o ID da subpasta copiada
      }
    }

    // Atualizar o campo `subfolders` da nova pasta com os IDs das subpastas copiadas
    await updateDoc(newFolderRef, { subfolders: newSubfolderIds });

    return newFolderRef.id; // Retorna o ID da nova pasta criada
  } catch (error) {
    console.error("Erro ao copiar a estrutura de pastas:", error);
    throw error;
  }
};
