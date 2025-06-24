import React, { useState, useEffect } from 'react';
import apiConfig from '../../config/apiConfig';

export type ResourceMetaData = {
  "resource": string,
  "fieldValues": any[]
};

const ReadFeedback = () => {
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = `${apiConfig.getResourceUrl('feedback')}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Feedback')}?`;
  const [imageurl, setImageUrl] = useState<string>('');

  const removesapce = (img: string) => {
    const formattedUrl = img.replace(/\s/g, '+');
    setImageUrl(formattedUrl);
  };
  
  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      const queryId: any = 'GET_ALL';
      params.append('queryId', queryId);
      params.append('session_id', ssid);
      try {
        const response = await fetch(apiUrl + params.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Error:' + response.status);
        const data = await response.json();
        // console.log(data.resource)
        if (data.resource.length > 0 && data.resource[0].Image) {
          removesapce(data.resource[0].Image)
        }
        setFeedbackData(data.resource || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchResourceData();
  }, []);

  // Fetch metadata
  useEffect(() => {
    const fetchResMetaData = async () => {
      try {
        const response = await fetch(metadataUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);
          setFields(metaData[0]?.fieldValues || []);
        } else {
          console.error('Failed to fetch metadata:' + response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchResMetaData();
  }, []);
  // console.log(fields)

  // Filter out system fields and get displayable fields
  const displayFields = fields.filter(field => !regex.test(field.name) && field.name !== 'id');

  return (
    <div className="container">
      <div className="my-4">
        <h2>Feedback</h2>
      </div>

      {feedbackData.length === 0 ? (
        <div className="alert alert-info">No feedback data available.</div>
      ) : (
        <div className="row">
          {feedbackData.map((feedback, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  {displayFields.map((field) => (
                    <div key={field.name} className="mb-3">
                      <strong>{field.name}:</strong>
                      {field.name === 'Image' ? (
                        feedback[field.name] ? (
                          <div className="mt-2">
                            <img 
                              src={imageurl} 
                              alt="Feedback" 
                              className="img-thumbnail" 
                              style={{ 
                                maxWidth: "100%", 
                                height: "auto",
                                maxHeight: "200px",
                                objectFit: "contain" 
                              }} 
                            />
                          </div>
                        ) : (
                          <span className="ms-2">N/A</span>
                        )
                      ) : (
                        <span className="ms-2">
                          {feedback[field.name] || 'N/A'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showToast && (
        <div className="toast-container position-fixed top-0 end-0 p-3">
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success">
              Feedback submitted successfully!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadFeedback;