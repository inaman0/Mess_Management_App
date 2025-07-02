import MenuUploader from '../components/FileUploader'

const UploadMenu = () => {
  return (
    <MenuUploader
        acceptedFileType=".xlsx"
        uploadUrlMeal="http://localhost:8083/api/meal"
        uploadUrlMenuItem="http://localhost:8083/api/menu_item"
        readMealUrl="http://localhost:8083/api/meal?"
   />


  );
};

export default UploadMenu