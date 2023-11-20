import React, {
    Routes,
    Route,
    Navigate
  } from 'react-router-dom';
import DogBreeds from './src/components/DogBreeds';

  function RouteList({dogs}) {
    return (
      <Routes>
        <Route
          path="/auth/login"
          element={<DogList dogs={dogs} />}
        />

        <Route
          path="/auth/logout"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/dogs/breeds"
          element={<DogBreeds />}
        />

        <Route
          path="/dogs/search"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/dogs"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/dogs/match"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/locations"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/locations/search"
          element={<FilterDogDetails dogs={dogs} />}
        />

        <Route
          path="/*"
          element={<Navigate to="/dogs" />}
        />
      </Routes>
    );
  }

  export default RouteList;

