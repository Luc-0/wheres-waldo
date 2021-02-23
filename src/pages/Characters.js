import './Characters.css';
import CharacterCard from '../components/CharacterCard';

const Characters = (props) => {
  return (
    <div className="characters">
      {props.characters && props.characters.length > 0 ? (
        props.characters.map((char) => (
          <CharacterCard
            key={char.imageURL}
            style={{ width: '200px', height: '200px' }}
            imageURL={char.imageURL}
            name={char.name}
            formatName={props.formatName}
          />
        ))
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Characters;
