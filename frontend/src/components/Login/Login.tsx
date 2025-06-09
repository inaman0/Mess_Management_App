import Login1 from "./Login1";

import "../../App.css";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

import { LoginContext, User } from "../../context/LoginContext";
import { login } from "../../apis/backend";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const [formData, setFormData] = useState<User>({
    email_id: "",
    password: "",
  });
  const [error, setError] = useState(""); // Updated: Added state for error handling

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    console.log("User", user);
    setUser(formData);
    const lowerCaseName: string = formData.email_id.toLowerCase();
    if (
      lowerCaseName === "admin@rasp.com" &&
      formData.password === "admin@123"
    ) {
      console.log("User inside useEffect", user);

      setIsLoggedIn(true);
      console.log("Is user Logged In:", isLoggedIn);
    } else {
      setIsLoggedIn(false);
    }
  }, [formData]);

  // Function to check if email is valid
  const isEmailValid = () => {
    // console.log("Email validity: ",emailRegex.test(formData.email_id));
    return emailRegex.test(formData.email_id);
  };

  // Function to check if password satisfies requirements
  const isPasswordValid = () => {
    // Implement your password validation logic here
    // For example, check if password length is greater than or equal to 8 characters
    // console.log("Password validity: ",formData.password.length >= 6 );
    return formData.password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // setUser(formData);
    const lowerCaseName: string = formData.email_id.toLowerCase();
    if (
      lowerCaseName === "admin@rasp.com" &&
      formData.password === "admin@123"
    ) {
      setFormData({
        ...formData,
        ["email_id"]: lowerCaseName,
        ["password"]: formData.password,
      });

      const loginObj: User = formData;

      const ssid = await login(loginObj);
      // const session_id = await res.json();
      // const ssid = res;

      console.log("User session Id after submit", ssid);

      // setIsLoggedIn(true);
      // console.log("Is user Logged In after submit:", isLoggedIn);

      // Set data in session storage
      sessionStorage.setItem("key", ssid);
      // Get data from session storage 
      const value = sessionStorage.getItem("key");
      console.log("Ssid after submit:",value); // Output: value
      if(ssid){
        navigate("/page1");
      }
      
    } else if (lowerCaseName !== "admin@rasp.com") {
      setError("Invalid email"); // Updated: Set error message for invalid credentials
    } else if (formData.password !== "admin@123") {
      setError("Invalid password"); // Updated: Set error message for invalid credentials
    } else {
      setError("Invalid email or password");
    }
    // navigate("/dashboard");
  };

  // const handleLogin = () => {};

  
    return (
      <Login1 
        formData={formData} 
        setFormData={setFormData} 
        error={error} 
        setError={setError} 
        handleSubmit={handleSubmit} 
        isEmailValid={isEmailValid} 
        isPasswordValid={isPasswordValid} 
      />
    );
  
};

export default Login;
