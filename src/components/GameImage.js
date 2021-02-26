import React, { useEffect, useState } from 'react';
import './GameImage.css';
import utils from '../helpers/utils';

const GameImage = (props) => {
  const [isPopupOnScreen, setIsPopupOnScreen] = useState(false);
  const [imageClickPosition, setImageClickPosition] = useState([0, 0]);
  const [imageCorrectCircles, setImageCorrectCircles] = useState([]);

  const [popupPositionStyle, setPopupPositionStyle] = useState({
    top: '0',
    left: '0',
  });
  const [selectCirclePositionStyle, setSelectCirclePositionStyle] = useState({
    top: '0',
    left: '0',
  });

  const imageId = 'game-image';

  useEffect(() => {
    window.addEventListener('click', handleOutsideImageClick);

    return function cleanup() {
      window.removeEventListener('click', handleOutsideImageClick);
    };

    function handleOutsideImageClick(e) {
      const targetId = e.target.id;

      if (targetId != imageId) {
        hidePopup();
      }
    }
  });

  return (
    <div className="wheres-waldo-img-container">
      <img id={imageId} onClick={handleImageClick} src={props.imageURL} />
      <div
        style={
          isPopupOnScreen
            ? selectCirclePositionStyle
            : { ...selectCirclePositionStyle, visibility: 'hidden' }
        }
        className="select-circle"
      ></div>
      {imageCorrectCircles}
      <div
        style={
          isPopupOnScreen
            ? popupPositionStyle
            : { ...popupPositionStyle, visibility: 'hidden' }
        }
        className="option-popup"
      >
        {props.charactersName.map((charName) => (
          <span data-value={charName} onClick={handleOptionClick}>
            {utils.capitalizeString(charName)}
          </span>
        ))}
      </div>
    </div>
  );

  function handleOptionClick(e) {
    const optionValue = e.target.dataset.value;

    // If valid add circle around click position
    if (props.isValidCharacterPosition(imageClickPosition, optionValue)) {
      props.handleCharacterPosition(imageClickPosition, optionValue);
      addCircle(selectCirclePositionStyle);
    }
  }

  function handleImageClick(e) {
    const nativeEvent = e.nativeEvent;

    // Return if has no more options to popup
    if (!props.charactersName.length > 0) {
      return;
    }

    // Get click percentage location
    const offsetX = nativeEvent.offsetX;
    const offsetY = nativeEvent.offsetY;
    const offsetWidth = +nativeEvent.target.offsetWidth;
    const offsetHeight = +nativeEvent.target.offsetHeight;
    let xPercentage = getPercentage(offsetX, offsetWidth);
    let yPercentage = getPercentage(offsetY, offsetHeight);

    setPopupPosition(xPercentage, yPercentage);
    showPopup();
    setImageClickPosition([xPercentage, yPercentage]);
    setSelectCirclePositionStyle({
      top: `${yPercentage}%`,
      left: `${xPercentage}%`,
      transform: `translate(-${xPercentage}%, -${yPercentage}%)`,
    });
  }

  function setPopupPosition(xPercentage, yPercentage) {
    let popupXPercentage = xPercentage;
    let popupYPercentage = yPercentage;

    if (xPercentage > 85) {
      popupXPercentage -= 20;
    } else {
      popupXPercentage += 5;
    }
    if (yPercentage > 85) {
      popupYPercentage -= 10;
    }

    setPopupPositionStyle({
      top: `${popupYPercentage}%`,
      left: `${popupXPercentage}%`,
    });
  }

  function showPopup() {
    setIsPopupOnScreen(true);
  }

  function hidePopup() {
    setIsPopupOnScreen(false);
  }

  function addCircle(circlePositionStyle) {
    const newImageCorrectCircles = [...imageCorrectCircles];
    const circle = (
      <div style={circlePositionStyle} className="select-circle"></div>
    );
    newImageCorrectCircles.push(circle);

    setImageCorrectCircles(newImageCorrectCircles);
  }

  function getPercentage(fromNumber, inNumber) {
    return (fromNumber * 100) / inNumber;
  }
};

export default GameImage;
