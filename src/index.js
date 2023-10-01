import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import VConsole from "vconsole";

process.env.NODE_ENV === 'development' && new VConsole();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);

