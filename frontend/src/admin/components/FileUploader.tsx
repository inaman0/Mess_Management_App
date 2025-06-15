import React, { useState } from 'react'
import './FileUploader.css'
import { postFormData } from '../api/postFormData'


type FileUploaderProps = {
  acceptedFileType: string
  uploadUrl: string
}

const FileUploader: React.FC<FileUploaderProps> = ({ acceptedFileType, uploadUrl }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [showStatus, setShowStatus] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadStatus('')
    setShowStatus(true)

    const formData = new FormData()
    if (selectedFile) {
      formData.append('file', selectedFile)
    }
    const success = await postFormData(uploadUrl, formData)
    if (success) {
      setUploadStatus('success')
    } else {
      setUploadStatus('error')
    }
    setIsUploading(false)
    setSelectedFile(null)
  }

  const getStatusMessage = () => {
    if (!showStatus) return null

    if (uploadStatus === 'success') {
      return (
        <div className="status-box success">
          <div>Menu uploaded successfully!</div>
          <button onClick={() => setShowStatus(false)} className="close-btn">
            <svg className="icon-small" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )
    }

    if (uploadStatus === 'error') {
      return (
        <div className="status-box error">
          <div>Upload failed. Please try again.</div>
          <button onClick={() => setShowStatus(false)} className="close-btn">
            <svg className="icon-small" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )
    }

    return null
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith(acceptedFileType)) {
      setSelectedFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith(acceptedFileType)) {
      setSelectedFile(file)
    }
  }

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
            accept={acceptedFileType}
            onChange={handleFileSelect}
            id="fileInput"
            className="hidden-input"
          />
          <label htmlFor="fileInput" className="file-label">
            <div className="drop-message">
              <div className="drop-icon">
                <svg
                  className="icon-large"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <div className="drop-text">
                {selectedFile
                  ? selectedFile.name
                  : `Drag and drop your ${acceptedFileType} file here or click to browse`}
              </div>
              <div className="drop-subtext">Only {acceptedFileType} files are supported</div>
            </div>
          </label>
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={!selectedFile || isUploading}
        >
          {isUploading ? (
            <>
              <svg
                className="spinner"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            'Upload Menu'
          )}
        </button>
      </form>
    </div>
  )
}

export default FileUploader
