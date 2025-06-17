import MenuUploader from '../components/FileUploader'

const UploadMenu = () => {
  return (
    <MenuUploader acceptedFileType='.xlsx' uploadUrl='/api/admin/menu'/>
  );
};

export default UploadMenu