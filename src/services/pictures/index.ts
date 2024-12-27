import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export async function uploadTakePicture(
  uri: string,
  fileName: string | undefined,
  folderPath: string[],
  onProgressUpdate: (progress: number) => void
): Promise<string> {
  // Modifiquei o tipo de retorno para refletir que retorna uma string (o caminho).
  try {
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    const metadata = {
      contentType: "image/jpeg",
    };

    const path = `photos/${folderPath.join("/")}/${fileName}`;

    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

    // Retorna a promise do upload corretamente.
    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgressUpdate(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          resolve();
        }
      );
    });

    const downloadURL = await getDownloadURL(fileRef);

    return downloadURL;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function getFolderImages(folderPath: string[]) {
  try {
    const folderRef = ref(storage, `photos/${folderPath.join("/")}`);

    const folderSnapshot = await listAll(folderRef);

    const mainFolderImages = await Promise.all(
      folderSnapshot.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          url,
          id: item.fullPath.split("/").pop(),
        };
      })
    );

    return mainFolderImages;
  } catch (error) {
    console.error("Erro ao buscar imagens da pasta no Storage:", error);
    return [];
  }
}

export async function deleteImage(folderPath: string[], idImage: string) {
  try {
    const path = `photos/${folderPath.join("/")}/${idImage}`;

    const fileRef = ref(storage, path);

    await deleteObject(fileRef);

    return true;
  } catch (error) {
    console.error("Erro ao excluir imagem:", error);
    throw new Error("Não foi possível excluir a imagem. Tente novamente.");
  }
}
