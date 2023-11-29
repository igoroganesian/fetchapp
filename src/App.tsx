import React, { useState, useEffect } from 'react';
import { login, logout } from './services/authService';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
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
  const [dogIds, setSelectedDogIds] = useState<string[]>([]);
  const [favoriteDogs, setFavoriteDogs] = useState<string[]>([]);
  const [fetchedDogs, setFetchedDogs] = useState<Dog[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showFetchedDogs, setShowFetchedDogs] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        // console.log("breeds: ", breeds);
        setDogBreeds(breeds);
      } catch (error) {
        console.error('Error in fetchBreeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  const handleLogin = async (username: string, email: string) => {
    try {
      const response = await login(username, email);
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
    setIsLoading(true);
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
      if (data.resultIds.length > 0) {
        await fetchDogsDetails(data.resultIds); // Fetch dog details after search
      } else {
        setFetchedDogs([]); // Set empty array if no results
      }
      setIsLoading(false); // Reset loading state
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false); // Reset loading state in case of error
    }
  };

  const handleCheckboxChange = (dogId: string) => {
    if (favoriteDogs.includes(dogId)) {
      setFavoriteDogs(favoriteDogs.filter(id => id !== dogId));
    } else {
      setFavoriteDogs([...favoriteDogs, dogId]);
    }
  };

  const fetchDogsDetails = async (dogIds: string[]) => {
    try {
      if (dogIds.length === 0 || dogIds.length > 100) {
        throw new Error("Please select between 1 to 100 dogs.");
      }

      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dogIds),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error fetching dogs');
      }

      const dogData = await response.json();
      console.log("DOG DATA: ", dogData);
      setFetchedDogs(dogData);
      setShowFetchedDogs(true);
      // console.log("Fetched Dogs: ", dogData);
    } catch (error) {
      console.error('Error in fetchDogs:', error);
    }
  };

  const renderFetchedDogs = () => {
    if (!showFetchedDogs || fetchedDogs.length === 0) {
      return null;
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
                <label>
                  <input
                  type="checkbox"
                  checked={favoriteDogs.includes(dog.id)}
                  onChange={() => handleCheckboxChange(dog.id)}
                  />
                  Add to Favorites
              </label>
              </div>
            </div>
          ))}
        </ul>
      </div>
    );
  };

  const toggleSearchForm = () => {
    setShowSearchForm(prevState => !prevState);
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    if (!showFetchedDogs || fetchedDogs.length === 0) {
      return null;
    }
    if (!showSearchResults || searchResults.length === 0) {
      return null;
    }

    return (
      <ul>
        <button onClick={() => fetchDogsDetails(dogIds)}>Fetch Selected Dogs</button>
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

  const matchDogs = async () => {
    try {
      const response = await fetch('https://frontend-take-home-service.fetch.com/dogs/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(favoriteDogs),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Matched Dog ID: ", data.match);
    } catch (error) {
      console.error("Error fetching match: ", error);
    }
  };

  return (
    <BrowserRouter>
      <div className={isAuth ? 'loggedIn' : ''}>
        {isAuth ? (
          <>
            <button className='logoutButton' onClick={handleLogout}>Logout</button>
            <Navigate to="/search" />
          </>
        ) : (
          <LoginForm onLogin={handleLogin} />
        )}
        <Routes>
          <Route
            path="/search"
            element={
              isAuth ? (
                <>
                  <button className='searchToggleButton' onClick={toggleSearchForm}>
                    {showSearchForm ? "Hide Search Form" : "Show Search Form"}
                  </button>
                  {showSearchForm && <SearchForm onSearch={handleSearch} breeds={dogBreeds} />}
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        <button className='matchButton' onClick={matchDogs}>Find Match</button>
        <div className='searchResults'>
          {renderSearchResults()}
        </div>
        <div className='fetchedDogs'>
          {renderFetchedDogs()}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;