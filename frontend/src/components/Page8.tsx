
        import React, { useState, useEffect } from 'react';
        import "./Page8.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateReview from './Resource/CreateReview';
            
            import ReadReview from './Resource/ReadReview';
            
            import UpdateReview from './Resource/UpdateReview';
            export default function Page8() {
            const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-17"><CreateReview/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-19"><ReadReview/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-1B"><UpdateReview/></div>
            </>
          );
        }