import {
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../../../firebaseConfig";

export async function uploadTakePicture(
  uri: string,
  fileName: string | undefined,
  folderPath: string[]
) {
  try {
    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    const metadata = {
      contentType: "image/jpeg",
    };

    const path = `photos/${folderPath.join("/")}/${fileName}`;

    const fileRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(fileRef, blob, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload progress:", progress);
        },
        (error) => {
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL });
        }
      );
    });
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
