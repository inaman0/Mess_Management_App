import React from 'react'
import './SickMeals.css'
import ReadSick_meal from '../../components/Resource/ReadSick_meal'

const SickMeals = () => {
  return (
    <>
          <h2 className='title'>Sick Meal Requests</h2>
          <div className="wrapper">
              <ReadSick_meal />
          </div>
        </>
  )
}

export default SickMeals