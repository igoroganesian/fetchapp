import React, { useState } from 'react';
import './SearchForm.css';

interface SearchParams {
    breeds?: string;
    zipCodes?: string;
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: string;
    sort?: string;
  }

interface SearchFormProps {
  onSearch: (searchParams: SearchParams) => void;
  breeds: string[];
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [breeds, setBreeds] = useState('');
  const [zipCodes, setZipCodes] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [size, setSize] = useState('');
  const [from, setFrom] = useState('');
  const [sort, setSort] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch({
      breeds,
      zipCodes,
      ageMin: ageMin ? parseInt(ageMin) : undefined,
      ageMax: ageMax ? parseInt(ageMax) : undefined,
      size: size ? parseInt(size) : undefined,
      from,
      sort
    });
  };

  return (
    <div className='search-form'>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter breeds" value={breeds} onChange={(e) => setBreeds(e.target.value)} />
        <input type="text" placeholder="Enter zip codes" value={zipCodes} onChange={(e) => setZipCodes(e.target.value)} />
        <input type="number" placeholder="Minimum age" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
        <input type="number" placeholder="Maximum age" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
        <input type="number" placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} />
        <input type="text" placeholder="From (cursor)" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input type="text" placeholder="Enter sort field and direction (ex. breed:asc / zipcode:desc)" value={sort} onChange={(e) => setSort(e.target.value)} />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchForm;
