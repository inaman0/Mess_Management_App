import React, { useEffect, useState } from 'react';
import apiConfig from '../../config/apiConfig';
import './ReadSick_meal.css';

export type ResourceMetaData = {
  resource: string;
  fieldValues: any[];
};

const ReadSick_meal = () => {
  const [rowData, setRowData] = useState<any[]>([]);
  const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 5;
  const regex = /^(g_|archived|extra_data)/;

  const apiUrl = `${apiConfig.getResourceUrl('sick_meal')}?`;
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('SickMeal')}?`;

  // Fetch data
  useEffect(() => {
    const fetchResourceData = async () => {
      const params = new URLSearchParams();
      const ssid = sessionStorage.getItem('key');
      const queryId = 'GET_ALL';
      params.append('queryId', queryId);
      params.append('session_id', ssid || '');

      try {
        const response = await fetch(apiUrl + params.toString(), {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Error: ' + response.status);
        const data = await response.json();
        setRowData(data.resource || []);
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

        if (!response.ok) throw new Error('Error: ' + response.status);
        const metaData = await response.json();
        setResMetaData(metaData);
        setFields(
          metaData[0]?.fieldValues?.filter(
            (field: any) => !regex.test(field.name) && field.name !== 'id'
          ) || []
        );
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };

    fetchResMetaData();
  }, []);

  const totalPages = Math.ceil(rowData.length / itemsPerPage);
  const paginatedData = rowData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="sickmeal-container">
      <div className="sickmeal-header">
        <h2>Sick Meal Requests</h2>
      </div>

      {paginatedData.length === 0 ? (
        <div className="alert">No data available.</div>
      ) : (
        <div className="sickmeal-grid">
          {paginatedData.map((meal, index) => (
            <div key={index} className="sickmeal-card">
              {fields.map((field) => (
                <div key={field.name} className="sickmeal-item">
                  <strong>{field.name}:</strong>{' '}
                  {(field.name.toLowerCase() === 'description' ||
                    field.name.toLowerCase() === 'reason') ? (
                    <div className="sickmeal-text-scroll">
                      <span>{meal[field.name] || 'N/A'}</span>
                    </div>
                  ) : (
                    <span>{meal[field.name] || 'N/A'}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span className="page-count">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReadSick_meal;
