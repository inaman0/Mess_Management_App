
        import React, { useState, useEffect } from 'react';
        import "./Page7.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateSick_meal from './Resource/CreateSick_meal';
            
            import ReadSick_meal from './Resource/ReadSick_meal';
            
            import UpdateSick_meal from './Resource/UpdateSick_meal';
            export default function Page7() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-11"><CreateSick_meal/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-13"><ReadSick_meal/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-15"><UpdateSick_meal/></div>
            </>
          );
        }