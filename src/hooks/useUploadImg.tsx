import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const useUploadImg = (url: string) => {
  const [imgUrl, setImgUrl] = useState(url);
  const [uploadProgress, setUploadProgress] = useState(0);
  function uploadImg(file: File) {
    const storageRef = ref(storage, `images/${uuidv4()}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setUploadProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL);
        });
      }
    );
  }
  return { uploadImg, imgUrl, uploadProgress, setImgUrl };
};

export default useUploadImg;
