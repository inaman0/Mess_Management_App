import React from 'react'
import CreateSick_meal from '../../components/Resource/CreateSick_meal'
import './SickMeal.css'
import ReadSick_meal from '../../components/Resource/ReadSick_meal'


const Sickmeal = () => {
  return (
    <div className='d-flex justify-content-center align-items-center vh-90'>
      <CreateSick_meal />
      <ReadSick_meal/>
    </div>
  )
}

export default Sickmeal
