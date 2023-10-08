import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Board from './game/Board';
import LandingPage from './landing/LandingPage';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route index element={<LandingPage />} />
      <Route path=":gameId" element={<Board />} />
    </Routes>
  </BrowserRouter>
);

export default App;
