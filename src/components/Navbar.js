import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-title">
        <Link to="/wheres-waldo">
          <h1>Where's Waldo</h1>
        </Link>
      </div>
      <ul>
        <li>
          <Link to="/wheres-waldo/characters">Characters</Link>
        </li>
        <li>
          <Link to="/wheres-waldo/about">About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
