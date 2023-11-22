import React, { useState, useEffect } from 'react';
import { login, logout } from './services/authService';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import './App.css';

/** REFERENCE */

// interface Dog {
//   id: string;
//   img: string;
//   name: string;
//   age: number;
//   zip_code: string;
//   breed: string;
// }

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
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);

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

      // breeds
      if (searchParams.breeds) {
        searchParams.breeds.split(',').forEach(breed => {
          const formattedBreed = breed.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          queryParams.append('breed', formattedBreed);
        });
      }

      // zipCodes
      if (searchParams.zipCodes) {
        searchParams.zipCodes.split(',').forEach(zipCode => {
          queryParams.append('zipCode', zipCode.trim());
        });
      }

      // ageMin, ageMax, size, from, and sort
      if (searchParams.ageMin) queryParams.append('ageMin', searchParams.ageMin.toString());
      if (searchParams.ageMax) queryParams.append('ageMax', searchParams.ageMax.toString());
      if (searchParams.size) queryParams.append('size', searchParams.size.toString());
      if (searchParams.from) queryParams.append('from', searchParams.from);
      if (searchParams.sort) queryParams.append('sort', searchParams.sort);

      const response = await fetch(`https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error searching for dogs');
      }

      const data = await response.json();
      setSearchResults(data.resultIds);
      console.log("searchResults: ", searchResults);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleCheckboxChange = (dogId: string) => {
    setSelectedDogIds(prevSelected => {
      if (prevSelected.includes(dogId)) {
        console.log(selectedDogIds);
        return prevSelected.filter(id => id !== dogId);
      } else {
        console.log(selectedDogIds);
        return [...prevSelected, dogId];
      }
    });
  };

  const fetchDogs = async () => {
    try {
      if (selectedDogIds.length === 0 || selectedDogIds.length > 100) {
        throw new Error("Please select between 1 to 100 dogs.");
      }
      // const payload = JSON.stringify(selectedDogIds);
      // console.log("Payload being sent:", payload);

      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedDogIds),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error fetching dogs');
      }

      const dogData = await response.json();
      console.log("Fetched Dogs: ", dogData);
      // You can do something with the dogData here, like setting it to state or processing it further
    } catch (error) {
      console.error('Error in fetchDogs:', error);
    }
  };

  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return <p>No results found.</p>;
    }

    return (
      <ul>
        <button onClick={fetchDogs}>Fetch Selected Dogs</button>
        {searchResults.map(dogId => (
          <li key={dogId}>
            <input
              type="checkbox"
              id={`checkbox-${dogId}`}
              onChange={() => handleCheckboxChange(dogId)}
            />
            <label htmlFor={`checkbox-${dogId}`}>{dogId}</label>
          </li>
        ))}
      </ul>
    );
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
      <div>
        {renderSearchResults()}
      </div>
    </BrowserRouter>
  );
};

export default App;