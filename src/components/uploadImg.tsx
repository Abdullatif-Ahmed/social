import { memo, useState } from "react";
import Dropzone from "react-dropzone";
import { IoClose } from "react-icons/io5";
type UploadImgType = {
  uploadProgress: number;
  url: string;
  onImageChange: (img: File) => void;
  onRemove: () => void;
};
const UploadImg = memo((props: UploadImgType) => {
  const { uploadProgress, url, onImageChange, onRemove } = props;
  const [imgUrl, setImgUrl] = useState(url);

  const [img, setImg] = useState<File | null>(null);
  function handleChange(files: File[]) {
    if (files) {
      setImg(files[0]);
      setImgUrl(URL.createObjectURL(files[0]));
      onImageChange(files[0]);
    }
  }
  return (
    <div>
      {!imgUrl ? (
        <Dropzone
          onDrop={handleChange}
          accept={{
            "image/png": [".png"],
            "image/jpg": [".jpg"],
            "image/jpeg": [".jpeg"],
            "image/webp": [".webp"],
          }}
          multiple={false}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <section>
              <div
                {...getRootProps()}
                className={`cursor-pointer border px-2 py-4 text-center ${
                  isDragActive ? "border-primary-effect" : ""
                }`}
              >
                <input
                  {...getInputProps({
                    accept: "image/*",
                    multiple: false,
                  })}
                />
                <p>Drop image here, or click to select image.</p>
              </div>
            </section>
          )}
        </Dropzone>
      ) : (
        <div className="relative">
          {img && (
            <div className="absolute left-0 top-0 w-full h-1 bg-slate-500">
              <span
                style={{ width: `${uploadProgress}%` }}
                className="bg-primary-effect h-full block"
              ></span>
            </div>
          )}
          <img
            width={450}
            height={250}
            src={imgUrl}
            alt="post image"
            className="w-full aspect-video "
          />
          <button
            aria-label="remove the image"
            className="absolute right-1 top-1 p-1 rounded-full bg-slate-500 hover:bg-slate-600 transition"
            onClick={() => {
              setImgUrl("");
              setImg(null);
              onRemove();
            }}
          >
            <IoClose size={20} />
          </button>
        </div>
      )}
    </div>
  );
});

export default UploadImg;
