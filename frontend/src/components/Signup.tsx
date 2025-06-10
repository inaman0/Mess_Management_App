
        import React, { useState, useEffect } from 'react';
        import "./Signup.css";
        import { useNavigate } from 'react-router-dom';
        
            import CreateUser from './Resource/CreateUser';
            
            // import ReadUser from './Resource/ReadUser';
            
            // import UpdateUser from './Resource/UpdateUser';
            // const navigate = useNavigate();
            
          export default function Signup() {
          return (
            <>
            <div className="d-flex justify-content-center align-items-center vh-100">
              <CreateUser />
            </div>

            {/* <div className="d-flex flex-column border border-2 h-50" id="id-3"><ReadUser/></div>
            <div className="d-flex flex-column border border-2 h-50" id="id-5"><UpdateUser/></div> */}
            </>
          );
        }