import React, { Component } from 'react';
import styles from './bg.module.css';
import { TweenMax, TimelineLite } from 'gsap/all';

class Bg extends Component {
    constructor(props) {
        super(props);

        this.bgMotion = new TimelineLite({ paused: true, repeat: -1 });
    }
    componentDidMount() {
        let charStatus = this.props.charStatus;
        let $bg = document.getElementById('bg');

        this.bgMotion.to($bg, 10, {x: -300});
        this.bgMotion.play();
        //TweenMax.to($bg, 1, {x: -300});
    }
    render() {
        return(
            <div id="bg" className={styles.bg} data-status={this.props.charStatus}></div>
        );
    }
}

export default Bg;