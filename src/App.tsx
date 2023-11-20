import React, { useState, useEffect } from 'react';
import { login, logout } from './services/authService';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import './App.css';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}

interface SearchParams {
  breeds?: string;
  zipCodes?: string;
  ageMin?: number;
  ageMax?: number;
  size?: number;
  from?: string;
  sort?: string;
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

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchParams.breeds) {
        searchParams.breeds.split(',').forEach(breed => {
          const formattedBreed = breed.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          queryParams.append('breed', formattedBreed);
        });
      }

      const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error searching for dogs');
      }

      const data = await response.text();
      console.log("response data: ", data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <BrowserRouter>
      <div>
        {isAuth ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <Navigate to="/search" />
          </>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
      <Routes>
        <Route
          path="/search"
          element={
            isAuth ? (
              <>
                <SearchForm onSearch={handleSearch} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;