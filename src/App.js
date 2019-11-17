import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import 'resources/js/resources.js';
import 'resources/css/reset.css';

import Header from 'component/layout/Header';
import Gnb from 'component/layout/Gnb';
import Main from 'component/main/Main';
import About from 'component/about/About';
import View from 'component/view/View';
import NotFound from 'component/etc/NotFound';

class App extends Component {
  render() {
    return(
        <Router>
            {/*<Header></Header>
            <Gnb></Gnb>*/}
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
