import './App.css';

import React, { useState, useReducer } from 'react';

import Login from './components/Login';
import Register from './components/Register.jsx';
import NotMatchPage from './components/NoMatchPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import Navbar from './components/Navbar';
import Store from './components/Store';
import ProductList from './components/ProductList';

import { UserContext } from './UserContext';

import {Route, Switch, BrowserRouter} from 'react-router-dom';

let initialUser = {
  isLoggedIn: false,
  currentUserId: null,
  currentUserName: null,
  currentUserRole: null,
};

let reducer = (state, action) => {
  switch(action.type){
    case "login":
      return {
        isLoggedIn: true,
        currentUserId: action.payload.currentUserId,
        currentUserName: action.payload.currentUserName,
        currentUserRole: action.payload.currentUserRole,
      };
    case "logout":
      return {
        isLoggedIn: false,
        currentUserId: null,
        currentUserName: null,
        currentUserRole: null,
      }
    default:
      return state;
  }
  
}

function App() {

  const [user, dispatch] = useReducer(reducer, initialUser);

  return (
    <UserContext.Provider value={{ user, dispatch}}>
      <BrowserRouter>
        <Navbar />
          <div className="container-fluid">
          <Switch>
            <Route path="/" exact component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/store" component={Store} />
            <Route path="/products" component={ProductList} />
            <Route path="*" component={NotMatchPage} />
          </Switch>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
