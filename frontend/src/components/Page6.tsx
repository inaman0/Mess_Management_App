
        import React, { useState, useEffect } from 'react';
        import "./Page6.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateMenu_item from './Resource/CreateMenu_item';
            
            import ReadMenu_item from './Resource/ReadMenu_item';
            
            import UpdateMenu_item from './Resource/UpdateMenu_item';
            export default function Page6() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-V"><CreateMenu_item/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-X"><ReadMenu_item/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-Z"><UpdateMenu_item/></div>
            </>
          );
        }