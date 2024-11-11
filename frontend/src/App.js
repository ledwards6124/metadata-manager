import logo from './logo.svg';
import './App.css';
import Files from './components/Files';
import React from 'react';



class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Files />
      </div>
    );
  }
}

export default App;
