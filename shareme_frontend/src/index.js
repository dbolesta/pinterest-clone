import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Router>
        <GoogleOAuthProvider clientId="410069267229-ugq8ep4f0hhk7f47mocppasc22m1la2g.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </Router>
);
