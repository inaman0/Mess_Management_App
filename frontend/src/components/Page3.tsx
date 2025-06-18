
        import React, { useState, useEffect } from 'react';
        import "./Page3.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateMenu from './Resource/CreateMenu';
            
            import ReadMenu from './Resource/ReadMenu';
            
            import UpdateMenu from './Resource/UpdateMenu';
            export default function Page3() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-D"><CreateMenu/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-F"><ReadMenu/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-H"><UpdateMenu/></div>
            </>
          );
        }  