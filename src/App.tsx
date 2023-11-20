import React, { useState, useEffect } from 'react';
import { login, logout } from './services/authService';
import { BrowserRouter } from 'react-router-dom';
import './App.css';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface Location {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
}
interface Coordinates {
  lat: number;
  lon: number;
}

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await login('testName', 'email@gmail.com');
      setIsAuth(true);
      console.log(response.message);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuth(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <BrowserRouter>
      <div>
        {isAuth ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )
        }
      </div>
    </BrowserRouter>
  );
};

export default App;