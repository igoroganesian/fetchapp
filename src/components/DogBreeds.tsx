import React, { useState, useEffect } from 'react';

const DogBreeds = () => {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch('https://your-api-endpoint.com/dogs/breeds');
        if (!response.ok) {
          throw new Error('Error fetching dogs');
        }
        const data = await response.json();
        setBreeds(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreeds();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {breeds.map(breed => (
        <li key={breed}>
          <a href="#">{breed}</a>
        </li>
      ))}
    </ul>
  );
};

export default DogBreeds;
