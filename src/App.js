import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Characters from './pages/Characters';
import { firestore } from './services/firebase';

const db = firestore();

function App() {
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="app">
      <Router>
        <Navbar />
        <Route
          exact
          path="/wheres-waldo/characters"
          render={() => (
            <Characters characters={characters} formatName={capitalizeString} />
          )}
        />
      </Router>
    </div>
  );

  async function fetchCharacters() {
    const charactersData = [];

    const charactersDocuments = await db.collection('characters').get();
    charactersDocuments.forEach((doc) => {
      charactersData.push(doc.data());
    });

    setCharacters(charactersData);
  }

  function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default App;
