import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated } from 'react-spring';

function SearchPage() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 200
  });

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await axios.get('https://frontend-take-home-service.fetch.com/dogs/breeds');
        setBreeds(response.data);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    }
    fetchBreeds();
  }, []);

  const handleSearch = async (page = 1) => {
    try {
      const from = (page - 1) * pageSize;
      const response = await axios.get(`https://frontend-take-home-service.fetch.com/dogs/search?breeds=${selectedBreed}&from=${from}&size=${pageSize}`);
      const dogIds = response.data.resultIds;
      if (dogIds.length) {
        const dogDataResponse = await axios.post('https://frontend-take-home-service.fetch.com/dogs', dogIds);
        setDogs(dogDataResponse.data);
      } else {
        setDogs([]);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  const toggleFavorite = (dogId) => {
    if (favorites.includes(dogId)) {
      setFavorites(favorites.filter(id => id !== dogId));
    } else {
      setFavorites([...favorites, dogId]);
    }
  };

  const handleMatch = async () => {
    // Aquí puedes hacer una llamada API para obtener una coincidencia basada en los favoritos
    // Por simplicidad, vamos a elegir un perro al azar de los favoritos como "coincidencia"
    const randomFavorite = favorites[Math.floor(Math.random() * favorites.length)];
    alert(`Your match is: ${randomFavorite}`);
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://frontend-take-home-service.fetch.com/auth/logout', {}, { withCredentials: true });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <animated.div style={fadeIn} className="container mt-5">
      <h1>Search Page</h1>
      <button onClick={handleLogout}>Logout</button>
      <div className="mb-4">
        <label htmlFor="breedSelect" className="form-label">Select a Breed</label>
        <select id="breedSelect" className="form-select" value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}>
          <option value="">Select a breed...</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{breed}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary mb-4" onClick={() => handleSearch(1)}>Search</button>
      <button onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>Advanced Options</button>
      {showAdvancedOptions && (
        <div>
          <h2>Favorites</h2>
          <ul>
            {favorites.map(favorite => (
              <li key={favorite}>{favorite}</li>
            ))}
          </ul>
          <button onClick={handleMatch}>Generate Match</button>
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
                <button onClick={() => toggleFavorite(dog.id)}>
                  {favorites.includes(dog.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => handleSearch(currentPage + 1)}>Next</button>
      </div>
    </animated.div>
  );
}

export default SearchPage;
