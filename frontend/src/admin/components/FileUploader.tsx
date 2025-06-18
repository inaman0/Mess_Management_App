// components/FileUploader.tsx

import React, { useState } from 'react';
import './FileUploader.css';
import { handleFileUpload, MealPlan, submitMealPlansToMongo } from '../utils/excelParser';

interface MealUploaderProps {
  uploadUrlMeal: string;
  acceptedFileType: string;
}

export default function FileUploader({ uploadUrlMeal }: MealUploaderProps) {
  const [excelData, setExcelData] = useState<MealPlan[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showStatus, setShowStatus] = useState(true);
  const [isDragActive, setIsDragActive] = useState(false); 

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      const data = await handleFileUpload(file);
      setExcelData(data);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      const data = await handleFileUpload(file);
      setExcelData(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus('');
    setShowStatus(true);

    if (!excelData) {
      setUploadStatus('error');
      setIsUploading(false);
      return;
    }

    const session_id = sessionStorage.getItem('key');
    if (!session_id) {
      setUploadStatus('error');
      setIsUploading(false);
      return;
    }

    const result = await submitMealPlansToMongo(excelData, uploadUrlMeal, session_id);
    setUploadStatus(result);
    setIsUploading(false);
    if (result === 'success') {
      setExcelData(null);
      setSelectedFile(null);
    }
  };

  const getStatusMessage = () => {
    if (!showStatus) return null;
    if (uploadStatus === 'success') return <div className="status-box success">Upload successful!</div>;
    if (uploadStatus === 'partial') return <div className="status-box warning">Partially uploaded.</div>;
    if (uploadStatus === 'error') return <div className="status-box error">Upload failed.</div>;
    return null;
  };

  return (
    <div className="uploader-wrapper">
      {getStatusMessage()}
      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`drop-area ${isDragActive ? 'drag-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
          onDragLeave={() => setIsDragActive(false)}
          onDrop={handleDrop}
        >
          <input type="file" accept=".xlsx" onChange={handleFileSelect} id="fileInput" className="hidden-input" />
          <label htmlFor="fileInput" className="file-label">
            <div className="drop-message">
              <div className="drop-icon">📂</div>
              <div className="drop-text">
                {selectedFile ? selectedFile.name : 'Drag & drop .xlsx here or click to browse'}
              </div>
              <div className="drop-subtext">Only .xlsx files are supported</div>
            </div>
          </label>
        </div>
        <button type="submit" className="upload-button" disabled={!selectedFile || isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {/* {excelData && (
        <div style={{ marginTop: '20px' }}>
          <h4>Parsed Excel Data (JSON):</h4>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )} */}
    </div>
  );
}
