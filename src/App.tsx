import React, { useState, useEffect } from 'react';
import { login, logout } from './services/authService';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SearchForm from './components/SearchForm';
import './App.css';

/** REFERENCE */

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
  const [dogBreeds, setDogBreeds] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const [fetchedDogs, setFetchedDogs] = useState<Dog[]>([]);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/breeds', {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Error fetching breeds');
        }
        const breeds = await response.json();
        console.log("breeds: ", breeds);
        setDogBreeds(breeds);
      } catch (error) {
        console.error('Error in fetchBreeds:', error);
      }
    };

    fetchBreeds();
  }, []);

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
      setSearchResults([]);
      setSelectedDogIds([]);
      setFetchedDogs([]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = async (searchParams: SearchParams) => {
    try {
      const queryParams = new URLSearchParams();
      // console.log("dogBreeds: ", dogBreeds);
      // breeds
      if (searchParams.breeds) {
        searchParams.breeds.split(',').forEach(breed => {
          const formattedBreed = breed.trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          queryParams.append('breeds', formattedBreed);
        });
      }

      // zipCodes
      if (searchParams.zipCodes) {
        searchParams.zipCodes.split(',').forEach(zipCode => {
          queryParams.append('zipCodes', zipCode.trim());
        });
      }

      // ageMin, ageMax, size, from, and sort
      if (searchParams.ageMin) queryParams.append('ageMin', searchParams.ageMin.toString());
      if (searchParams.ageMax) queryParams.append('ageMax', searchParams.ageMax.toString());
      if (searchParams.size) queryParams.append('size', searchParams.size.toString());
      if (searchParams.from) queryParams.append('from', searchParams.from);
      if (searchParams.sort) queryParams.append('sort', searchParams.sort);

      // console.log("FULL URL: ", `https://frontend-take-home-service.fetch.com/dogs/search?${queryParams.toString()}`);
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
      setFetchedDogs(dogData);
      console.log("Fetched Dogs: ", dogData);
    } catch (error) {
      console.error('Error in fetchDogs:', error);
    }
  };

  const renderFetchedDogs = () => {
    if (fetchedDogs.length === 0) {
      return <p>No dogs fetched yet.</p>;
    }

    return (
      <div>
        <h2>Fetched Dogs</h2>
        <ul>
          {fetchedDogs.map(dog => (
            <div key={dog.id} className='fetchedDog'>
              <img src={dog.img} alt={dog.name} />
              <div className='fetchedDog-text'>
                <p>Name: {dog.name}</p>
                <p>Age: {dog.age}</p>
                <p>Zip Code: {dog.zip_code}</p>
                <p>Breed: {dog.breed}</p>
              </div>
            </div>
          ))}
        </ul>
      </div>
    );
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
                <SearchForm onSearch={handleSearch} breeds={dogBreeds} />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <div className='searchResults'>
        {renderSearchResults()}
      </div>
      <div className='fetchedDogs'>
        {renderFetchedDogs()}
      </div>
    </BrowserRouter>
  );
};

export default App;