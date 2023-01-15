import { useState, useEffect, useRef } from "react";
import { useField } from "formik";

import ProfileImagePlaceholder from "../UIElements/ProfileImagePlaceholder";

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="text-xs text-red-700">{meta.error}</div>
      ) : null}
    </>
  );
};

export const TextAreaInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <textarea
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        {...field}
        {...props}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </>
  );
};

export const URLInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
          http://
        </span>
        <input
          className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          {...field}
          {...props}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="text-xs text-red-700">{meta.error}</div>
      ) : null}
    </>
  );
};

export const ImageUpload = ({ label, ...props }) => {
  const [field, meta, helper] = useField(props);
  const { setValue } = helper;
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const filePickerRef = useRef();
  const existingImage = props.image;

  useEffect(() => {
    if (existingImage) {
      setPreviewUrl(`${process.env.REACT_APP_BASE_URL}/${existingImage}`);
    }
  }, []);

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
      setValue(pickedFile);
    }
  };

  const clearImageHandler = () => {
    setValue(null);
    setFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        className="hidden"
        ref={filePickerRef}
        {...props}
        onChange={pickedHandler}
      />
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
      <div className="mt-1 flex items-center">
        <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
          {previewUrl && (
            <img className="h-full w-full" src={previewUrl} alt="Preview" />
          )}
          {!previewUrl && <ProfileImagePlaceholder />}
        </span>
        <button
          type="button"
          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={pickImageHandler}
        >
          Change
        </button>
        <button
          type="button"
          className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={clearImageHandler}
        >
          Clear
        </button>
      </div>
    </>
  );
};
