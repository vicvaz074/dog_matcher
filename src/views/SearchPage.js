import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';

function SearchPage() {
  // State for breed selection
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  
  // State for displaying dogs
  const [dogs, setDogs] = useState([]);
  
  // Advanced search states
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Favorites and pagination
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const pageSize = 10;

  // Animation for fade in effect
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 200
  });

  // Fetch the list of breeds on component mount
  useEffect(() => {
    async function fetchBreeds() {
      const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds');
      setBreeds(response.data);
    }
    fetchBreeds();
  }, []);

  // Handle search with pagination and advanced options
  const handleSearch = async (page = 1) => {
    setShowFavorites(false);
    let query = `https://frontend-take-home-service.fetch.com/dogs/search?breeds=${selectedBreed}&from=${(page - 1) * pageSize}&size=${pageSize}`;
    
    if (showAdvanced) {
      if (ageMin) query += `&ageMin=${ageMin}`;
      if (ageMax) query += `&ageMax=${ageMax}`;
      if (zipCode) query += `&zipCodes=${zipCode}`;
    }

    const response = await axios.get(query);
    const dogIds = response.data.resultIds;
    if (dogIds.length) {
      const dogDataResponse = await axios.post('https://frontend-take-home-service.fetch.com/dogs', dogIds);
      setDogs(dogDataResponse.data);
    } else {
      setDogs([]);
    }
    setCurrentPage(page);
  };

  // Toggle favorite status for a dog
  const toggleFavorite = (dogId) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter(id => id !== dogId));
    } else {
      setFavorites([...favorites, dogId]);
    }
  };

  // Display only favorite dogs
  const handleViewFavorites = () => {
    setShowFavorites(true);
    const favoriteDogs = dogs.filter(dog => favorites.includes(dog.id));
    setDogs(favoriteDogs);
  };

  // Randomly match with a dog
  const handleRandomMatch = () => {
    if (dogs.length) {
      const randomDog = dogs[Math.floor(Math.random() * dogs.length)];
      alert(`Matched with: ${randomDog.name}`);
    } else {
      alert('No dogs available for matching!');
    }
  };

  return (
    <animated.div style={fadeIn} className="container mt-5">
      <h1>Search Page</h1>
      <div className="mb-4">
        <label htmlFor="breedSelect" className="form-label">Select a Breed</label>
        <select id="breedSelect" className="form-select" value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">Select a breed...</option>
          {breeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
        </select>
      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button className="btn btn-primary mb-4" onClick={() => handleSearch(1)}>Search</button>
        <button className="btn btn-secondary mb-4 ml-2" onClick={() => setShowAdvanced(!showAdvanced)}>Advanced Options</button>
      </div>
      {showAdvanced && (
        <div className="mb-4">
          <label htmlFor="ageMin">Min Age:</label>
          <input type="number" id="ageMin" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
          <label htmlFor="ageMax">Max Age:</label>
          <input type="number" id="ageMax" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
          <label htmlFor="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
      )}
      <div style={{display: 'flex', justifyContent: 'center'}}>
        <button onClick={handleViewFavorites}>View Favorites</button>
        <button onClick={handleRandomMatch} className="ml-2">Match with a Random Dog</button>
      </div>
      <div className="row mt-4">
        {dogs.map(dog => (
          <div key={dog.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={dog.img} alt={dog.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{dog.name}</h5>
                <p className="card-text">Age: {dog.age}</p>
                <p className="card-text">Breed: {dog.breed}</p>
                <p className="card-text">Zip Code: {dog.zip_code}</p>
                <button onClick={() => toggleFavorite(dog.id)}>
                  {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!showFavorites && (
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <button onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          <button onClick={() => handleSearch(currentPage + 1)} className="ml-2">Next</button>
        </div>
      )}
    </animated.div>
  );
}

export default SearchPage;
