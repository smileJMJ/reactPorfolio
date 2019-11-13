import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Header from './component/Header';
import Gnb from './component/Gnb';
import Main from './component/Main';
import About from './component/About';
import View from './component/View';
import NotFound from './component/NotFound';

class App extends Component {
  render() {
    return(
        <Router>
            <Header></Header>
            <Gnb></Gnb>
            <Switch>
                <Route path="/about" component={About}/>
                <Route path="/view/:id" component={View}/>
                <Route exact path="/" component={Main}/>
                <Route component={NotFound}/>
            </Switch>
        </Router>
    )
  }
}
export default App;
