import { initializeApp } from 'firebase/app';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './app/App';

initializeApp({
  apiKey: 'AIzaSyAon5sU3HnLBOff-qtHTjXiyUrRp7DuTFI',
  authDomain: 'game-ce466.firebaseapp.com',
  projectId: 'game-ce466',
  storageBucket: 'game-ce466.appspot.com',
  messagingSenderId: '617341184113',
  appId: '1:617341184113:web:56ab89edb2f57469bb93d0',
  databaseURL: 'https://game-ce466-default-rtdb.firebaseio.com',
  measurementId: 'G-33SSRBMY0K',
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
