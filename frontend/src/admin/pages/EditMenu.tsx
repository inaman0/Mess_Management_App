import React from 'react'
import UpdateMenu_item from '../../components/Resource/UpdateMenu_item'
import UpdateMeal from '../../components/Resource/UpdateMeal'
import EditMenuComponent from '../../components/Resource/EditMenuComponent'

const EditMenu = () => {
  return (
    <>
      <h1 className="title">Edit Menu</h1>
      <div className="uploader-wrapper">
        {/* Your upload menu components go here */}
        <UpdateMenu_item />
        <UpdateMeal />  
        <EditMenuComponent />      
      </div>
    </>
  )
}

export default EditMenu