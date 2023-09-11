import styles from './App.module.scss';
import Board from './game/Board';

export const App: React.FC = () => {
  return (
    <div className={styles['stuff']}>
      <Board />
    </div>
  );
};

export default App;
