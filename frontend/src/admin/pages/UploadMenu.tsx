import MenuUploader from '../components/FileUploader'

const UploadMenu = () => {
  return (
    <MenuUploader
  acceptedFileType=".xlsx"
  uploadUrlMeal="http://localhost:8083/api/meal"
/>


  );
};

export default UploadMenu