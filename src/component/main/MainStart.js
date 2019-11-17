import React, { Component } from 'react';
import Girl from './girl/Girl';
import Boy from './boy/Boy';
import Bg from './bg/Bg';
import styles from "./main.module.css";

class MainStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            charStatus: 'idle', // 캐릭터 상태 (idle, walk, run, jump, dead)
            sceneStatus: 'beforeStart' // 장면 상태 (beforeStart, afterStart)
        }
    }
    render() {
        return(
            <div id="main" className={styles.main} data-status="mainStart">
                <Girl charStatus={this.state.charStatus}></Girl>
                <Boy charStatus={this.state.charStatus}></Boy>
                <Bg charStatus={this.state.charStatus}></Bg>
            </div>
        );
    }
}
export default MainStart;