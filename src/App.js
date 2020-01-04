import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import 'resources/js/resources.js';
import 'resources/css/style.css';

import Header from 'component/layout/Header';
import Main from 'component/main/Main';
import About from 'component/about/About';
import List from 'component/list/List';
import View from 'component/view/View';
import NotFound from 'component/etc/NotFound';

class App extends Component {
    constructor(props) {
        super(props);
         // theme 초기 세팅
        let root = document.getElementById('root');
        root.dataset.theme = this.props.theme;
    }
    render() {
        return(
            <Router>
                <Header></Header>
                <Switch>
                    <Route path="/about" component={About}/>
                    <Route path="/work" component={List}/>
                    <Route path="/view/:id" component={View}/>
                    <Route exact path="/" component={Main}/>
                    <Route component={NotFound}/>
                </Switch>
            </Router>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        theme: state.theme
    }
};

export default connect(mapStateToProps)(App);
