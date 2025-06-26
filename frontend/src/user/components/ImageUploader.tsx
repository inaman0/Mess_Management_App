import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';

const MAX_FILE_SIZE = 128 * 1024; // 1024 KB

// Utility function to read file as dataURL
export const readImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      reject(new Error("Please select a JPG or PNG file."));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error("File size exceeds 1024KB limit."));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error("Failed to read file."));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file."));
    reader.readAsDataURL(file);
  });
};

// The exposed ref API
export type ImageUploaderHandle = {
  isValid: () => boolean;
};

// Props: value is the fileDataUrl
type ImageUploaderProps = {
  value: string;  // The fileDataUrl (dataURL string)
  onChange: (dataUrl: string) => void;
  required?: boolean;
};

export const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
  ({ value, onChange, required = false }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [touched, setTouched] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await readImageFile(file);
        console.log(dataUrl);
        onChange(dataUrl);
        setError(null);
        setTouched(true);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    console.log(value)

    useImperativeHandle(ref, () => ({
      isValid: () => {
        if (required && !value) {
          setError("This field is required.");
          return false;
        }
        return !error;
      }
    }));
    console.log(value)
    const openFileDialog = () => fileInputRef.current?.click();

    return (
      <div>
        <button className="btn text-white" style={{ backgroundColor: '#58b4c3' }} type="button" onClick={openFileDialog}>
          Upload Image
        </button>
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {required && touched && !value && !error && (
          <div className="alert alert-danger mt-2">This field is required.</div>
        )}

        {value && (
          <div className="mt-3">
            <p>Preview:</p>
            <img src={value} alt="Preview" className="img-thumbnail" style={{ maxWidth: "200px" }} />
          </div>
        )}
      </div>
    );
  }
);
