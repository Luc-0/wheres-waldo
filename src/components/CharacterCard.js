import React from 'react';
import './CharacterCard.css';

const CharacterCard = (props) => {
  return (
    <div style={props.style ? props.style : null} className="character-card">
      <img src={props.imageURL} />
      <p>{props.formatName ? props.formatName(props.name) : props.name}</p>
    </div>
  );
};

export default CharacterCard;
