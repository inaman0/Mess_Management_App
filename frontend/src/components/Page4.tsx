
        import React, { useState, useEffect } from 'react';
        import "./Page4.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateMeal from './Resource/CreateMeal';
            
            import ReadMeal from './Resource/ReadMeal';
            
            import UpdateMeal from './Resource/UpdateMeal';
            export default function Page4() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-J"><CreateMeal/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-L"><ReadMeal/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-N"><UpdateMeal/></div>
            </>
          );
        }