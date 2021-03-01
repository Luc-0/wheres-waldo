import React, { useState } from 'react';
import './Scoreboard.css';

export default function Scoreboard(props) {
  const [nameInput, setNameInput] = useState('');

  return (
    <div className="scoreboard">
      <button
        className="scoreboard-close-btn"
        onClick={
          props.handleCloseScoreboard ? props.handleCloseScoreboard : null
        }
      >
        X
      </button>

      {props.scores
        ? props.scores.map((score, index) => {
            return (
              <div className="scoreboard-score">
                <span>{index + 1}</span>
                <span>{score.name}</span>
                <span>
                  {props.formatTime ? props.formatTime(score.time) : score.time}
                </span>
              </div>
            );
          })
        : null}

      {props.newScore ? (
        <div className="scoreboard-add-score">
          <span>
            {props.formatTime
              ? props.formatTime(props.inputTime)
              : props.inputTime}
          </span>
          <label htmlFor="score-input">Name</label>
          <input
            id="score-input"
            type="text"
            maxLength="3"
            placeholder="3 Max"
            value={nameInput}
            onChange={handleNameInputChange}
          />
          <button
            onClick={() => {
              props.handleAddScore(nameInput);
            }}
          >
            Add
          </button>
        </div>
      ) : null}
    </div>
  );

  function handleNameInputChange(e) {
    setNameInput(e.target.value);
  }
}
