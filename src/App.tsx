import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';
import Checkout from './checkout'; // Make sure to import the Checkout component
import Profile from './Profile';

const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/profile"element={<Profile />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
