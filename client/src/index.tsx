import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { spy } from 'mobx';
import { App } from './app/App';
import './app/main.scss';
import { BrowserRouter } from 'react-router-dom';

// spy((e) => {
//   if (e.type === 'action') console.log(e);
// });

createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <App />
  //   </BrowserRouter>
  // </React.StrictMode>,
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
