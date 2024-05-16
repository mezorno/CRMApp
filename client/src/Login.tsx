import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:9001/user/login', {
        username,
        password
      });
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status code ${response.status}`);
      }
  
      // Store the JWT in local storage
      localStorage.setItem('token', response.data.token);
      // Clear any error message
      setErrorMessage('Logged in successfully ( i know its red but this is a good thing :D )');
    } catch (error) {
      console.error(error);
      // Set the error message
      setErrorMessage('Login failed. Please check your username and password.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /> <br/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /> <br/>
      <button type="submit">Login</button> <br/>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default Login;