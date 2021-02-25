import React, { useEffect, useState } from 'react';
import GameImage from './GameImage';
import './Game.css';
import { firestore } from '../services/firebase';
import CharacterCard from '../components/CharacterCard';

const Game = (props) => {
  const [characters, setCharacters] = useState([]);
  const [imagesDetails, setImagesDetails] = useState([]);
  const [currentGameData, setCurrentGameData] = useState();
  const [currentMissingNames, setCurrentMissingNames] = useState();
  const [isFetchDone, setIsFetchDone] = useState(false);

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
    }
  }, [currentGameData]);

  return (
    <div>
      {currentGameData && currentMissingNames ? (
        <div className="game">
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
          <GameImage
            charactersName={currentMissingNames}
            imageURL={currentGameData.imageURL}
            handleCharacterPosition={handleCharacterPosition}
            isValidCharacterPosition={isValidCharacterPosition}
          />
        </div>
      ) : (
        <div>loading</div>
      )}
    </div>
  );

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
