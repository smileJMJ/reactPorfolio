import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../action';
import List from './List';
import axios from "axios";


class Main extends Component {
    componentDidMount() {
        this.getData();
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
    render() {
        return(
            <div>
                <List data={this.props.listData}></List>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        listData: state.listData
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        loadMainHandler: (data) => {dispatch(actions.loadMain(data));}
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);