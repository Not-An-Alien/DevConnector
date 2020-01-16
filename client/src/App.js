import React, { Fragment } from 'react';
import './App.css';
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Bring in components 
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Route exact path='/' component={Landing} />
      <section className="container">
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/Login' component={Login} />
        </Switch>

      </section>
    </Fragment>
  </Router>
=======

>>>>>>> parent of bfdfa5c... Created login and register components

const App = () => (
  <Fragment>
    <h1>App</h1>
  </Fragment>
);


export default App;