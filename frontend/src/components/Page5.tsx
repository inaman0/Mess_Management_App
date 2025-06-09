
        import React, { useState, useEffect } from 'react';
        import "./Page5.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateDish from './Resource/CreateDish';
            
            import ReadDish from './Resource/ReadDish';
            
            import UpdateDish from './Resource/UpdateDish';
            export default function Page5() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-P"><CreateDish/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-R"><ReadDish/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-T"><UpdateDish/></div>
            </>
          );
        }