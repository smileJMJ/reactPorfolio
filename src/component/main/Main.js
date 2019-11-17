import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from 'action';

import MainStart from './MainStart';
import MainWebSite from './MainWebSite';
import MainWebSolution from './MainWebSolution';
import MainEnd from './MainEnd';

class Main extends Component {
    constructor(props) {
        super(props);
        this.style = {
            position: 'absolute',
            right: 10,
            top: 10,
            zIndex: 10
        }
        this.state = {
            mainStatus: 'start'
        }
    }
    changeMainComponent(mainStatus) { // mainStatus 바꾸기
        this.props.changeMainStatus(mainStatus); // this.setState 발생
    }
    mainStatusToComponent(mainStatus) {
        switch(mainStatus) {
            case 'start':
                return <MainStart></MainStart>;
            case 'website':
                return <MainWebSite></MainWebSite>;
            case 'websolution':
                return <MainWebSolution></MainWebSolution>;
            case 'end':
                return <MainEnd></MainEnd>;
            default:
                return <MainStart></MainStart>;
        }
    }
    render() {
        return(
            <div>
                {this.mainStatusToComponent(this.props.mainStatus)}
                <div style={this.style}>
                    <button type="button" onClick={(e) => this.changeMainComponent('start')}>START</button>
                    <button type="button" onClick={(e) => this.changeMainComponent('website')}>WEBSITE</button>
                    <button type="button" onClick={(e) => this.changeMainComponent('websolution')}>WEBSOLUTION</button>
                    <button type="button" onClick={(e) => this.changeMainComponent('end')}>END</button>
                </div>
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        mainStatus: state.mainStatus
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        changeMainStatus: (mainStatus) => {dispatch(actions.changeMainStatus(mainStatus))}
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
