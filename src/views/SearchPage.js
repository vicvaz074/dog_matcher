import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';

function SearchPage() {
  // States for breeds, selected breed, dogs, advanced options, favorites, and random match
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState([]);
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [randomDog, setRandomDog] = useState(null);

  // Animation effect
  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 200
  });

  // Fetch available breeds on component mount
  useEffect(() => {
    async function fetchBreeds() {
      const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds');
      setBreeds(response.data);
    }
    fetchBreeds();
  }, []);

  // Search handler
  const handleSearch = async () => {
    let query = `https://frontend-take-home-service.fetch.com/dogs/search?breeds=${selectedBreed}`;
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
  };

  // Add dog to favorites
  const handleAddToFavorites = (dog) => {
    setFavorites([...favorites, dog]);
  };

  // Random match handler
  const handleRandomMatch = () => {
    const randomIndex = Math.floor(Math.random() * dogs.length);
    const matchedDog = dogs[randomIndex];
    setRandomDog(matchedDog);
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
      <button className="btn btn-secondary mb-2" onClick={() => setShowAdvanced(!showAdvanced)}>Advanced Options</button>
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
      <button className="btn btn-primary mb-4" onClick={handleSearch}>Search</button>
      <button className="btn btn-success mb-4" onClick={handleRandomMatch}>Match with a Random Dog</button>
      {randomDog && (
        <div className="random-dog-match">
          <h3>Your Match:</h3>
          <div className="card">
            <img src={randomDog.img} alt={randomDog.name} className="card-img-top" />
            <div className="card-body">
              <h5 className="card-title">{randomDog.name}</h5>
              <p className="card-text">Age: {randomDog.age}</p>
              <p className="card-text">Breed: {randomDog.breed}</p>
              <p className="card-text">Zip Code: {randomDog.zip_code}</p>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        {dogs.map(dog => (
          <div key={dog.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={dog.img} alt={dog.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{dog.name}</h5>
                <p className="card-text">Age: {dog.age}</p>
                <p className="card-text">Breed: {dog.breed}</p>
                <p className="card-text">Zip Code: {dog.zip_code}</p>
                <button onClick={() => handleAddToFavorites(dog)}>Add to Favorites</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h3>Your Favorites:</h3>
        {favorites.map(dog => (
          <div key={dog.id}>
            <h4>{dog.name}</h4>
            <img src={dog.img} alt={dog.name} width="100" />
          </div>
        ))}
      </div>
    </animated.div>
  );
}

export default SearchPage;
