import FileUploader from '../components/FileUploader'

const UploadMenu = () => {
  return (
    <FileUploader acceptedFileType=".xlsx" uploadUrl="/api/admin/menu" />
  )
}

export default UploadMenu