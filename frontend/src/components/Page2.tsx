
        import React, { useState, useEffect } from 'react';
        import "./Page2.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateFeedback from './Resource/CreateFeedback';
            
            import ReadFeedback from './Resource/ReadFeedback';
            
            import UpdateFeedback from './Resource/UpdateFeedback';
            export default function Page2() {
          const navigate = useNavigate();

          return (
            <>
            <div className="d-flex flex-column border border-2 h-50" id="id-7"><CreateFeedback/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-9"><ReadFeedback/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-B"><UpdateFeedback/></div>
            </>
          );
        }