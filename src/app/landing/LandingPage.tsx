import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useFirebaseList } from '../firebase';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useFirebaseList(`/2048-game`);

  return (
    <div className="landing-page">
      <div className="jumbotron">
        <h2>Join the Numbers and Reach 2048!</h2>
        <p>
          2048 is a fun and addictive puzzle game that challenges your strategic
          thinking. Merge tiles with the same numbers to create higher-value
          tiles and reach the coveted 2048 tile.
        </p>
        <button
          onClick={() => navigate(`/${uuidv4()}`)}
          className="new-game-button"
        >
          Start new game
        </button>
      </div>

      {data.gameIds.map((gameId) => (
        <div key={gameId}>
          <Link to={gameId}>{gameId}</Link>
        </div>
      ))}
    </div>
  );
};

export default LandingPage;
