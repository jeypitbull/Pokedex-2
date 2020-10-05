import React, { Component } from 'react';
import './App.css';
import NavBar from "./components/layout/NavBar"

class App extends Component {
  render (){
    return (
      <div className="App">
        <NavBar />
      </div>
    )
  };
}

export default App;