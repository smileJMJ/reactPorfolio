import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import * as actions from 'action';
import styles from './main.module.css';

/*import List from '../list/List';
import Girl from './girl/Girl';
import Boy from './boy/Boy';
import Bg from './bg/Bg';*/
import MainStart from './MainStart';
import MainWebSite from './MainWebSite';
import MainWebSolution from './MainWebSolution';
import MainEnd from './MainEnd';
import axios from "axios";


class Main extends Component {
    componentDidMount() {
        this.getData();
        this.changeCharStatus('idle');
    }
    getData() {
        axios.get('/json/listData.json')
        .then(response => {
            let data = response['data']['data'];
            this.props.loadMainHandler(data);
        })
        .catch(error => {
            console.log(error);
        });
    }
    changeCharStatus(charStatus) {
        this.props.changeCharStatus(charStatus);
    }
    render() {
        return(
            /*<div>
                <List data={this.props.listData}></List>
            </div>*/
            /*<div id="main" className={styles.main}>
                <Girl charStatus={this.props.charStatus}></Girl>
                <Boy charStatus={this.props.charStatus}></Boy>
                <Bg charStatus={this.props.charStatus}></Bg>
            </div>*/
            <Switch>
                <Route path="/main/start" component={MainStart}></Route>
                <Route path="/main/website" component={MainWebSite}></Route>
                <Route path="/main/websolution" component={MainWebSolution}></Route>
                <Route path="/main/end" component={MainEnd}></Route>
            </Switch>

        );
    }
}

let mapStateToProps = (state) => {
    return {
        listData: state.listData,
        charStatus: state.charStatus
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        loadMainHandler: (data) => {dispatch(actions.loadMain(data));},
        changeCharStatus: (charStatus) => {dispatch(actions.changeCharStatus(charStatus))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);