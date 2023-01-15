import { useRef, useState, useEffect } from "react";

import ProfileImagePlaceholder from "../UIElements/ProfileImagePlaceholder";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const existingImage = props.image;
  console.log(props);

  if (existingImage) {
    console.log(existingImage);
    setPreviewUrl(existingImage);
  }

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
  };

  return (
    <div className="mt-1 flex items-center">
      <input
        id={props.id}
        name={props.id}
        ref={filePickerRef}
        type="file"
        accept=".jpg, .jpeg, .png"
        className="hidden"
        onChange={pickedHandler}
        {...props.register("image")}
      />
      <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
        {previewUrl && <img src={previewUrl} alt="Preview" />}
        {!previewUrl && <ProfileImagePlaceholder />}
      </span>
      <button
        type="button"
        className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={pickImageHandler}
      >
        Change
      </button>
    </div>
  );
};

export default ImageUpload;
