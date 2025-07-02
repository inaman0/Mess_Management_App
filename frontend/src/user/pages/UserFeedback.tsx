import React from 'react'
import CreateFeedback from '../../components/Resource/CreateFeedback'
import ReadFeedback from '../../components/Resource/ReadFeedback'
import './UserFeedback.css'

const UserFeedback = () => {
  return (
    <div className='d-flex justify-content-center align-items-center vh-90'>
      <CreateFeedback />
      <ReadFeedback />
    </div>
  )
}

export default UserFeedback
