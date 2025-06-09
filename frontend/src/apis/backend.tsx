import apiConfig from "../config/apiConfig";
import { User } from "../context/LoginContext";

export const login = async (user: User) => {
    console.log("Adding User: ", user);
    try {
      const params = new URLSearchParams();
  
      const jsonObj = user;
      const jsonString = JSON.stringify(jsonObj);
  
      // Encode string to Base64
      const base64Encoded = btoa(jsonString);
  
      // console.log(`Base Encoding of adding batch: ${base64Encoded}`);
  
      params.append("resource", base64Encoded);
      // params.append("session_id", "c64e3bda-7205-4a63-ac37-2d14ab7474bd-15");
  
      const response = await fetch(`${apiConfig.API_BASE_URL}/login?` + params.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
  
      // console.log("Resposne after submit: ", response);
      // console.log("response", response);
      const jsonData = await response.json();
      console.log("response json after submit,", jsonData);
      // console.log("Login output after submit",jsonData.resource[0].session_id);
      const ssid = jsonData.resource[0].session_id;
      return ssid;
      // return response;
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };