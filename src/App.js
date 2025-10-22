import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useLocation } from 'react-router-dom';

// Import Components
import TopBar from './components/TopBar/TopBar';
import Login from './components/Login/Login';
import Patient from './components/Patient/Patient';
import Practice from './components/Practice/Practice';
import Profile from './components/Profile/Profile';

import './App.css';

// A component to conditionally render the TopBar
const AppLayout = () => {
  const location = useLocation();
  const showTopBar = location.pathname !== '/login';

  return (
    <>
      {showTopBar && <TopBar />}
      <main className="app-content">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/patient" component={Patient} />
          <Route path="/practice" component={Practice} />
          <Route path="/profile" component={Profile} />

          {/* Redirect any unknown path to the login page */}
          <Redirect from="/" to="/login" />
        </Switch>
      </main>
    </>
  );
};


function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
