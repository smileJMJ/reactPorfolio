import React, { Component } from 'react';
import styles from './girl.module.css';

let girlInfo = {
    idle: {width: 416, height: 454, imgWidth: 6656, lastIndex: 0},
    dead: {width: 601, height: 509, imgWidth: 18030, lastIndex: 0},
    jump: {width: 416, height: 454, imgWidth: 12480, lastIndex: 0},
    run: {width: 416, height: 454, imgWidth: 8320, lastIndex: 0},
    walk: {width: 416, height: 454, imgWidth: 8320, lastIndex: 0}
};
let charStatus; // 캐릭터 상태
let girlCurrentInfo; // 현재 캐릭터 정보
let $girl; // girl selector

class Girl extends Component {
    componentDidMount() {
        charStatus = this.props.charStatus;
        girlCurrentInfo = girlInfo[charStatus];
        girlCurrentInfo['lastIndex'] = Math.floor(girlCurrentInfo['imgWidth'] / girlCurrentInfo['width']);
        $girl = document.getElementById('girl');
        this.girlMotion();
    }
    girlMotion() {
        let prevTime = 0;
        let i = 0;

        requestAnimationFrame(animation);
        function animation(t) {
            if(i >= girlCurrentInfo['lastIndex']) i = 0;
            $girl.style.backgroundPositionX = `${-(girlCurrentInfo['width'] * i)}px`;

            requestAnimationFrame(animation);
            if(prevTime + 40 <= t) {
                i++;
                prevTime = t;
            }

        }
    }
    render() {
        return (
            <div id="girl" className={styles.girl} data-status={this.props.charStatus}></div>
        );
    }
}

export default Girl;