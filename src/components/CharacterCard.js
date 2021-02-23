import React from 'react';
import './CharacterCard.css';
import utils from '../helpers/utils';

const CharacterCard = (props) => {
  return (
    <div style={props.style ? props.style : null} className="character-card">
      <img src={props.imageURL} />
      <p>{utils.capitalizeString(props.name)}</p>
    </div>
  );
};

export default CharacterCard;
