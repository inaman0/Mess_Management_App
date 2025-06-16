import MenuUploader from '../components/FileUploader'

const UploadMenu = () => {
  return (
    <MenuUploader acceptedFileType='.xlsx' uploadUrlMenu='/api/admin/menu' uploadUrlMeal='/api/admin/meal' uploadUrlMealItem='/api/admin/meal-item' />
  );
};

export default UploadMenu