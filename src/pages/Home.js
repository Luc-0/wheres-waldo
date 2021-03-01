import React, { useState } from 'react';
import './Home.css';
import Game from '../components/Game';

const Home = (props) => {
  return (
    <div className="home-page">
      <Game
        scoreboards={props.scoreboards}
        handleAddScore={props.handleAddScore}
      />
    </div>
  );
};

export default Home;
