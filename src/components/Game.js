import React, { useEffect, useState } from 'react';
import GameImage from './GameImage';
import './Game.css';
import { firestore } from '../services/firebase';
import CharacterCard from '../components/CharacterCard';
import Scoreboard from './Scoreboard';

const Game = (props) => {
  const [characters, setCharacters] = useState([]);
  const [imagesDetails, setImagesDetails] = useState([]);
  const [currentGameData, setCurrentGameData] = useState();
  const [currentMissingNames, setCurrentMissingNames] = useState();
  const [isFetchDone, setIsFetchDone] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [resetGameImage, setResetGameImage] = useState(false);
  const [count, setCount] = useState(0);
  const [isTimerOn, setIsTimerOn] = useState(false);
  const [scoreboardOpen, setScoreboardOpen] = useState(false);
  const [scoreboardNewScore, setScoreboardNewScore] = useState(false);
  const [currentScoreboard, setCurrentScoreboard] = useState();

  // Fetch game data
  useEffect(() => {
    loadGame();

    async function loadGame() {
      await fetchCharacters();
      await fetchImagesDetails();
      setIsFetchDone(true);
    }
  }, []);

  // Set default game image
  useEffect(() => {
    if (imagesDetails.length > 0) {
      setCurrentGameData(imagesDetails[0]);
    }
  }, [isFetchDone]);

  useEffect(() => {
    if (currentGameData) {
      setCurrentMissingNames(getCurrentCharsName());
      setCurrentScoreboard(getCurrentScoreboard(currentGameData.id));
      startTimer();
    }
  }, [currentGameData]);

  // Scoreboard update
  useEffect(() => {
    if (currentScoreboard) {
      setCurrentScoreboard(getCurrentScoreboard(currentScoreboard.id));
    }
  }, [props.scoreboards]);

  // Check if is gameover
  useEffect(() => {
    if (currentMissingNames && currentMissingNames.length === 0) {
      gameOver();
    }
  }, [currentMissingNames]);

  // Update count if timer is on
  useEffect(() => {
    if (!isTimerOn) {
      return;
    }

    const timeout = setTimeout(() => {
      setCount((c) => c + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isTimerOn, count]);

  return (
    <div>
      {scoreboardOpen ? (
        <Scoreboard
          scores={currentScoreboard.scores}
          inputTime={count}
          formatTime={formatTime}
          handleCloseScoreboard={handleCloseScoreboard}
          handleAddScore={handleAddScore}
          newScore={scoreboardNewScore}
        />
      ) : null}

      {currentGameData && currentMissingNames ? (
        <div className="game">
          <div className="game-menu">
            <span>{formatTime(count)}</span>
            <button onClick={handleRestartGame}>Restart</button>
          </div>
          {!isGameOver ? (
            <div className="find-character-container">
              <span>Find:</span>
              {characters.map((character) =>
                currentMissingNames.includes(character.name) ? (
                  <CharacterCard
                    name={character.name}
                    imageURL={character.imageURL}
                  />
                ) : (
                  false
                )
              )}
            </div>
          ) : null}
          <GameImage
            charactersName={currentMissingNames}
            imageURL={currentGameData.imageURL}
            handleCharacterPosition={handleCharacterPosition}
            isValidCharacterPosition={isValidCharacterPosition}
            reset={resetGameImage}
            handleReset={handleGameImageReset}
          />
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );

  function handleCloseScoreboard() {
    setScoreboardOpen(false);
  }

  function handleAddScore(name) {
    // TODO: Add new score with name,time
    // props.addScore(name, time, gameImageId)
    setScoreboardNewScore(false);
    props.handleAddScore(name, count, currentScoreboard.id);
  }

  function handleRestartGame() {
    restartGame();
  }

  function handleGameImageReset() {
    setResetGameImage(false);
  }

  function handleCharacterPosition(imageClickPosition, characterName) {
    if (isValidCharacterPosition(imageClickPosition, characterName)) {
      // Remove option name from missing names
      const newCurrMissingNames = [...currentMissingNames];
      const index = currentMissingNames.findIndex(
        (name) => name.toLowerCase() === characterName.toLowerCase()
      );
      newCurrMissingNames.splice(index, 1);

      setCurrentMissingNames(newCurrMissingNames);
    }
  }

  function gameOver() {
    setIsGameOver(true);
    stopTimer();
    setScoreboardOpen(true);

    // Check if is a top 10 score
    if (checkScoreTime(count)) {
      // Show scoreboard input for new score
      setScoreboardNewScore(true);
    }
  }

  function checkScoreTime(seconds) {
    if (currentScoreboard.scores.length === 0) {
      return true;
    }

    if (currentScoreboard.scores.length >= 10) {
      return currentScoreboard.scores.some((score) => score.time > seconds);
    }

    return true;
  }

  function restartGame() {
    resetCount();
    startTimer();
    setCurrentMissingNames(getCurrentCharsName());
    setIsGameOver(false);
    setResetGameImage(true);
    setScoreboardOpen(false);
    setScoreboardNewScore(false);
  }

  function startTimer() {
    setIsTimerOn(true);
  }

  function stopTimer() {
    setIsTimerOn(false);
  }

  function resetCount() {
    setCount(0);
  }

  function formatTime(seconds) {
    const newSeconds = seconds % 60;
    const minutes = Math.floor(seconds / 60) % 60;

    const formatMinutes = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
    const formatSeconds = `${
      newSeconds < 10 ? `0${newSeconds}` : `${newSeconds}`
    }`;
    return `${formatMinutes}:${formatSeconds}`;
  }

  function isValidCharacterPosition(imageClickPosition, characterName) {
    // Check if option name is missing
    const isMissing = currentMissingNames.includes(characterName.toLowerCase());
    if (isMissing) {
      const characterData = currentGameData['character-info'].find(
        (char) => char.name.toLowerCase() === characterName.toLowerCase()
      );

      // Get image clicked position
      const clickXPosition = imageClickPosition[0];
      const clickYPosition = imageClickPosition[1];

      // Check clicked position if it was the character position
      const validX =
        clickXPosition >= characterData.validX[0] &&
        clickXPosition <= characterData.validX[1];
      const validY =
        clickYPosition >= characterData.validY[0] &&
        clickYPosition <= characterData.validY[1];

      return validX && validY;
    }
  }

  function getCurrentCharsName() {
    const currentCharactersName = currentGameData[
      'character-info'
    ].map((char) => char.name.toLowerCase());

    return currentCharactersName;
  }

  function getCurrentScoreboard(scoreboardId) {
    const defaultScoreboard = { id: scoreboardId, scores: [] };
    if (!props.scoreboards || props.scoreboards.length === 0) {
      return defaultScoreboard;
    }

    const scoreboard = props.scoreboards.find(
      (scoreboard) => scoreboard.id === scoreboardId
    );

    return scoreboard ? scoreboard : defaultScoreboard;
  }

  async function fetchCharacters() {
    const charactersData = [];

    const charactersDocuments = await firestore()
      .collection('characters')
      .get();
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
};

export default Game;
