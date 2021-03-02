import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Characters from './pages/Characters';
import Home from './pages/Home';
import { firestore } from './services/firebase';

const db = firestore();

function App() {
  const [characters, setCharacters] = useState([]);
  const [scoreboards, setScoreboards] = useState([]);
  const [imagesDetails, setImagesDetails] = useState([]);

  useEffect(() => {
    fetchCharacters();
    fetchImagesDetails();
    loadScoreboards();
  }, []);

  return (
    <div className="app">
      {imagesDetails.length > 0 && characters.length > 0 ? (
        <Router>
          <Navbar />
          <Route
            exact
            path="/wheres-waldo"
            render={() => (
              <Home
                characters={characters}
                imagesDetails={imagesDetails}
                scoreboards={scoreboards}
                handleAddScore={handleAddScore}
              />
            )}
          />
          <Route
            exact
            path="/wheres-waldo/characters"
            render={() => <Characters characters={characters} />}
          />
        </Router>
      ) : null}
    </div>
  );

  async function fetchCharacters() {
    const charactersData = [];

    const charactersDocuments = await db.collection('characters').get();
    charactersDocuments.forEach((doc) => {
      charactersData.push(doc.data());
    });
    console.log('fetch characters');

    setCharacters(charactersData);
  }

  async function fetchImagesDetails() {
    const imagesDetailsData = [];

    const imagesDocuments = await firestore()
      .collection('images-details')
      .get();
    imagesDocuments.forEach((doc) => {
      imagesDetailsData.push({ id: doc.id, ...doc.data() });
    });
    console.log('fetch images');
    setImagesDetails(imagesDetailsData);
  }

  async function loadScoreboards() {
    const scoreboards = [];

    const scoreboardsDocuments = await db.collection('scoreboards').get();
    scoreboardsDocuments.forEach((doc) => {
      // Add snapshot listener to every document to update scoreboard on change
      db.collection('scoreboards')
        .doc(doc.id)
        .onSnapshot((doc) => {
          const scoreboardIndex = scoreboards.findIndex(
            (scoreboard) => scoreboard.id === doc.id
          );
          let newScoreboards = [...scoreboards];
          newScoreboards[scoreboardIndex] = {
            id: doc.id,
            scores: doc.data().scores ? sortScores(doc.data().scores) : [],
          };

          console.log('snapshot scoreboards');
          setScoreboards(newScoreboards);
        });

      // Push scoreboard
      const docData = doc.data();
      scoreboards.push({
        id: doc.id,
        scores: docData.scores ? sortScores(doc.data().scores) : [],
      });
    });
    console.log('fetch scoreboards');
    setScoreboards(scoreboards);
  }

  function handleAddScore(name, seconds, scoreboardId) {
    const scoreboardsRef = db.collection('scoreboards');

    scoreboardsRef
      .doc(`${scoreboardId}`)
      .get()
      .then((doc) => {
        const docRef = scoreboardsRef.doc(`${scoreboardId}`);
        const docData = doc.data();

        if (doc.exists) {
          const docScores = docData.scores ? docData.scores : [];
          // push a new score
          if (docScores.length < 10) {
            const newDocScores = [...docScores];
            newDocScores.push({ name: name, time: seconds });
            docRef.set({ scores: newDocScores });
          } else {
            // Replace the last place with new score
            const maxTime = Math.max(...docScores.map((score) => score.time));
            const indexOfMaxTime = docScores.findIndex(
              (score) => score.time === maxTime
            );

            if (!maxTime || indexOfMaxTime === -1) {
              return;
            }

            const newDocScores = [...docScores];
            newDocScores[indexOfMaxTime] = { name: name, time: seconds };
            docRef.set({ scores: newDocScores });
          }
        } else {
          // If has no doc create a new doc with the score
          const scores = [{ name: name, time: seconds }];
          docRef.set({ scores: scores });
        }
      });
  }

  // Sort in ascending order
  function sortScores(scores) {
    const sortedScores = [...scores].sort((scoreA, scoreB) => {
      return scoreA.time - scoreB.time;
    });

    return sortedScores;
  }
}

export default App;
