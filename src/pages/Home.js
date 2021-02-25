import React, { useState } from 'react';
import './Home.css';
import Game from '../components/Game';

const Home = (props) => {
  return (
    <div className="home-page">
      <Game />
    </div>
  );
};

export default Home;
