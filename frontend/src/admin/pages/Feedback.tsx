import React from 'react'
import ReadFeedback from '../../components/Resource/ReadFeedback'

const Feedback = () => {
  return (
    <>
      <h1 className="title">Feedback</h1>
      <div className="uploader-wrapper">
        {/* Your upload menu components go here */}
        <ReadFeedback />
      </div>
    </>
  )
}

export default Feedback