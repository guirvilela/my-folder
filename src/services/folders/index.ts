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
    console.error("Erro ao obter pastas:", error);
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

    console.log(`Subpasta criada com ID: ${folderRef.id}`);

    const mainFolderRef = doc(foldersCollection, parentId);
    await updateDoc(mainFolderRef, {
      subfolders: arrayUnion(folderRef.id),
    });

    console.log(
      `Subpasta ${folderRef.id} adicionada à pasta principal ${parentId}`
    );

    return folderRef.id;
  } catch (error) {
    console.error("Erro ao criar a subpasta:", error);
    throw error;
  }
}

export async function deleteFolder(folderId: string, parentId: string) {
  try {
    const foldersCollection = collection(firestore, "folders");

    // Obtém referência para a pasta pai
    const parentFolderRef = doc(foldersCollection, parentId);

    // Remove a subpasta da lista de subpastas da pasta pai
    await updateDoc(parentFolderRef, {
      subfolders: arrayRemove(folderId),
    });

    console.log(`Subpasta ${folderId} removida da pasta principal ${parentId}`);

    // Exclui a subpasta
    const folderRef = doc(foldersCollection, folderId);
    await deleteDoc(folderRef);

    console.log(`Subpasta ${folderId} excluída com sucesso`);
  } catch (error) {
    console.error("Erro ao excluir a pasta:", error);
    throw error;
  }
}
