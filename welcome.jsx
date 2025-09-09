import React from 'react';
import { FaWelcome } from 'react-icons/fa';

const Welcome = () => {
  return (
    <div className="container text-center mt-5">
      <FaWelcome size={100} color="#3498db" />
      <h1 className="display-4 my-3">Welcome to User Master UI</h1>
      <p className="lead">A comprehensive solution for managing users, workers, and services.</p>
    </div>
  );
};

export default Welcome;