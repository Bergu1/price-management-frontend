// Ten plik uruchamia całą aplikację Reacta w przeglądarce.
// ReactDOM.createRoot(...) tworzy root Reacta i w nim renderuje <App /> – główny komponent aplikacji.
// <App /> to miejsce, gdzie są zdefiniowane wszystkie strony i routing (Login, Register, Home itd.).

import React from "react";
import ReactDom from 'react-dom/client';
import App from './App';
import './index.css';

ReactDom.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);