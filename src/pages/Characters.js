import './Characters.css';

const Characters = (props) => {
  return (
    <div className="characters">
      {props.characters && props.characters.length > 0 ? (
        props.characters.map((char) => (
          <div key={char.imageURL} className="character-card">
            <img src={char.imageURL} />
            <p>{props.formatName ? props.formatName(char.name) : char.name}</p>
          </div>
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Characters;
