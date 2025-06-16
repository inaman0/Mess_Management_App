import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import './FileUploader.css'; // You can rename this to 'MenuUploader.css'
import { postFormData } from '../api/postFormData';

interface Dish {
  dishName: string;
  dishType: 'Veg' | 'Non-Veg' | 'Egg';
}

interface MealPlan {
  date: Date;
  day: string;
  breakfast: Dish[];
  lunch: Dish[];
  snacks: Dish[];
  dinner: Dish[];
}

type MenuUploaderProps = {
  acceptedFileType: string;
  uploadUrlMenu: string;
  uploadUrlMeal: string;
  uploadUrlMealItem: string;
};

export default function MenuUploader({ acceptedFileType, uploadUrlMenu, uploadUrlMeal, uploadUrlMealItem }: MenuUploaderProps) {
  const [excelData, setExcelData] = useState<MealPlan[] | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  const excelDateToMongoDate = (serial: number): Date => {
    const utcDays = serial - 25569;
    const utcMilliseconds = utcDays * 86400 * 1000;
    return new Date(utcMilliseconds);
  };

  const transformMenuData = (data: { [key: string]: (number | string)[] }): MealPlan[] => {
  const result: MealPlan[] = [];

  for (const day in data) {
    const items = data[day];
    const dates: number[] = [];

    let i = 0;
    while (typeof items[i] === 'number') {
      dates.push(items[i] as number);
      i++;
    }

    const mealSections: {
      [key: string]: { dishName: string; dishType: 'Veg' | 'Non-Veg' | 'Egg' }[];
    } = {
      BREAKFAST: [],
      LUNCH: [],
      SNACKS: [],
      DINNER: [],
    };

    let currentMeal = '';
    for (; i < items.length; i++) {
      const entry = items[i] as string;
      if (entry === '') continue;

      if (mealSections.hasOwnProperty(entry)) {
        currentMeal = entry;
        continue;
      }

     if (currentMeal && typeof entry === 'string') {
      const dishType =
      entry.toLowerCase().includes('chicken') ? 'Non-Veg' :
      entry.toLowerCase().includes('egg') ? 'Egg' :'Veg';

  mealSections[currentMeal].push({ dishName: entry, dishType });
}

    }

    for (const date of dates) {
      result.push({
        date: excelDateToMongoDate(date),
        day,
        breakfast: mealSections.BREAKFAST,
        lunch: mealSections.LUNCH,
        snacks: mealSections.SNACKS,
        dinner: mealSections.DINNER,
      });
    }
  }

  return result;
};

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (result) {
        const data = new Uint8Array(result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        const filteredData = parsedData.filter(
          row => Array.isArray(row) && row.some(cell => cell != null && cell !== '')
        );
        const [headers, ...rows] = filteredData;

        const transformedJson: { [key: string]: any[] } = {};
        headers.forEach((header: string, index: number) => {
          transformedJson[header] = rows.map(row => row[index]);
        });

        const mealPlanData = transformMenuData(transformedJson);
        setExcelData(mealPlanData);
        console.log('Parsed Excel Data:', mealPlanData);
      } else {
        console.error('FileReader result is null.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
      handleFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadStatus('');
    setShowStatus(true);

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    const success = await postFormData('/your-upload-url', formData);
    setUploadStatus(success ? 'success' : 'error');
    setIsUploading(false);
    setSelectedFile(null);
  };

  const getStatusMessage = () => {
    if (!showStatus) return null;

    if (uploadStatus === 'success') {
      return (
        <div className="status-box success">
          <div>Menu uploaded successfully!</div>
          <button onClick={() => setShowStatus(false)} className="close-btn">✖</button>
        </div>
      );
    }

    if (uploadStatus === 'error') {
      return (
        <div className="status-box error">
          <div>Upload failed. Please try again.</div>
          <button onClick={() => setShowStatus(false)} className="close-btn">✖</button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="uploader-wrapper">
      {getStatusMessage()}

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`drop-area ${isDragActive ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileSelect}
            id="fileInput"
            className="hidden-input"
          />
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

      {/* Display parsed JSON data */}
      {excelData && (
        <div style={{ marginTop: '20px' }}>
          <h4>Parsed Excel Data (JSON):</h4>
          <pre>{JSON.stringify(excelData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
