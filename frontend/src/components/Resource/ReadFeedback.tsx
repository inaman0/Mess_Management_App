import React, { useState } from 'react';
                  import { useEffect } from 'react';
                  import apiConfig from '../../config/apiConfig';
                   import {
              AllCommunityModule,
              ModuleRegistry,
              themeAlpine,
              themeBalham,
            } from "ag-grid-community";
            import { AgGridReact } from "ag-grid-react";
            
            ModuleRegistry.registerModules([AllCommunityModule]);
                  export type ResourceMetaData = {
                    "resource": string,
                    "fieldValues":any[]
                  }
  
                  const ReadFeedback= () => {
    const [rowData, setRowData] = useState<any[]>([]);
    const [colDef1, setColDef1] = useState<any[]>([]);
    const [resMetaData, setResMetaData] = useState<ResourceMetaData[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [dataToSave, setDataToSave] = useState<any>({});
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [fetchData, setFetchedData] = useState<any[]>([]);
   const [showToast,setShowToast] = useState<any>(false);

  const regex = /^(g_|archived|extra_data)/;
  const apiUrl = `${apiConfig.getResourceUrl('feedback')}?`
  const metadataUrl = `${apiConfig.getResourceMetaDataUrl('Feedback')}?`
  const BaseUrl = '${apiConfig.API_BASE_URL}';
  // Fetch resource data
  useEffect(() => {
    const fetchResourceData = async () => {
      console.log('Fetching data...');
      const params = new URLSearchParams();
      const ssid: any = sessionStorage.getItem('key');
      const queryId: any = 'GET_ALL';
      params.append('queryId', queryId);
      params.append('session_id', ssid);
      try {
        const response = await fetch(
          apiUrl+params.toString(),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Error:'+ response.status);
        }
        const data = await response.json();
        console.log('Data after fetching', data);
        setFetchedData(data.resource || []);
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
        const response = await fetch(
          metadataUrl,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        if (response.ok) {
          const metaData = await response.json();
          setResMetaData(metaData);
          setFields(metaData[0]?.fieldValues || []);
          const required = metaData[0]?.fieldValues
            .filter((field: any) => !regex.test(field.name))
            .map((field: any) => field.name);
          setRequiredFields(required || []);
        } else {
          console.error('Failed to fetch metadata:'+ response.statusText);
        }
      } catch (error) {
        console.error('Error fetching metadata:', error);
      }
    };
    fetchResMetaData();
  }, []);
  useEffect(() => {
    
    const data = fetchData || [];
    const fields = requiredFields.filter(field => field !== 'id') || [];
    
    const columns = fields.map(field => ({
      field: field,
      headerName: field,
      editable: false,
      resizable: true,
      sortable: true,
      filter: true
    }));
    
    setColDef1(columns);
    setRowData(data);
  }, [fetchData, requiredFields]);

  const defaultColDef = {
    flex: 1,
    minWidth: 100,
    editable: false,
  }; 

  return (
    <div>
        <div>
         <h2> ReadFeedback </h2>
        </div>



<div >
    {rowData.length === 0 && colDef1.length === 0 ? (
      <div>No data available. Please add a resource attribute.</div>
    ) : (
      <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDef1}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        animateRows={true}
        rowSelection="multiple"
      />
    </div>
    )}
    </div>
    {showToast && (
        <div
          className="toast-container position-fixed top-20 start-50 translate-middle p-3"
          style={{ zIndex: 1550 }}
        >
          <div className="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Success</strong>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
            <div className="toast-body text-success text-center">Created successfully!</div>
          </div>
        </div>
    ) }
    
    </div>
    )
    
    
    };
    
    export default ReadFeedback