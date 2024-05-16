import axios from 'axios';
import e from 'express';
import { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:9001/user/register', {
        username,
        password,
        email
      });
  
      if (response.status !== 200) {
        throw new Error(`Request failed with status code ${response.status}`);
      }
  
      // Clear any error message
      setErrorMessage('Registration successful. Please login. ( i know its red but this is a good thing :D )');
    } catch (error) {
      console.error(error);
      // Set the error message
      setErrorMessage('Registration failed. Please check your input.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" /> <br/>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" /> <br/>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" /> <br/>
      <button type="submit">Register</button> <br/>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default Register;