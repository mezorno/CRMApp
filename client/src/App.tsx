import React from 'react';
import logo from './logo.svg';
import './App.css';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div>
      <h1>Login</h1>
      <Login/>
      <br/>
      <br/>
      <br/>
      <h1>Registration</h1>
      <Register/>
    </div>
  );
}

export default App;
