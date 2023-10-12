import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setIsAuthenticated }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const animationProps = useSpring({
    opacity: 1,
    marginTop: 0,
    from: { opacity: 0, marginTop: -50 },
    delay: 200
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://frontend-take-home-service.fetch.com/auth/login', {
        name: name,
        email: email
      }, {
        withCredentials: true
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate('/search');
      }

    } catch (err) {
      setError('Error, please try again');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <animated.div style={animationProps}>
            <div className="card">
              <div className="card-header">Login</div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name:</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  {error && <p className="text-danger mt-2">{error}</p>}
                  <button type="submit" className="btn btn-primary mt-3">Login</button>
                </form>
              </div>
            </div>
          </animated.div>
        </div>
      </div>
    </div>
  );
} 

export default Login;
