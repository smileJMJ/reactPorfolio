import React, { Component } from 'react';
import styles from './boy.module.css';

let boyInfo = {
    idle: {width: 614, height: 564, imgWidth: 9210, lastIndex: 0},
    dead: {width: 614, height: 564, imgWidth: 9210, lastIndex: 0},
    jump: {width: 614, height: 564, imgWidth: 9210, lastIndex: 0},
    run: {width: 614, height: 564, imgWidth: 9210, lastIndex: 0},
    walk: {width: 614, height: 564, imgWidth: 9210, lastIndex: 0}
};
let boyCurrentInfo; // 현재 캐릭터 정보
let $boy; // boy selector

class boy extends Component {
    componentDidMount() {
        let charStatus = this.props.charStatus;
        boyCurrentInfo = boyInfo[charStatus];
        boyCurrentInfo['lastIndex'] = Math.floor(boyCurrentInfo['imgWidth'] / boyCurrentInfo['width']);
        $boy = document.getElementById('boy');
        this.boyMotion();
    }
    boyMotion() {
        let prevTime = 0;
        let i = 0;

        requestAnimationFrame(animation);
        function animation(t) {
            if(i >= boyCurrentInfo['lastIndex']) i = 0;
            $boy.style.backgroundPositionX = `${-(boyCurrentInfo['width'] * i)}px`;

            requestAnimationFrame(animation);
            if(prevTime + 50 <= t) {
                i++;
                prevTime = t;
            }

        }
    }
    render() {
        return (
            <div id="boy" className={styles.boy} data-status={this.props.charStatus}></div>
        );
    }
}

export default boy;