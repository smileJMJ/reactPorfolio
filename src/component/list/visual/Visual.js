import React, { Component } from 'react';
import axios from 'axios';
import Ripple from './module/Ripple';
import VisualDom from './module/visualDom';

class Visual extends Component {
    // List에서 props로 data 받을 때, data 변경될 때만 rerender하기 위해 설정
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.data !== nextProps.data) return true;
        return false;
    }
    componentDidMount() {
        let rippleCanvas, ripple;

        rippleCanvas = document.getElementById('ripple');
        rippleCanvas.width = rippleCanvas.clientWidth;
        rippleCanvas.height = rippleCanvas.clientHeight;

        ripple = new Ripple(rippleCanvas, {
            resolution: 1080,
            perturbance: 0.01,
            interactive: true
        });
        ripple.init();

        setInterval(function() {
            let x = Math.random() * rippleCanvas.width;
            let y = Math.random() * rippleCanvas.height;
            let dropRadius = 300;
            let strength = 0.05 + Math.random() * 0.04;

            ripple.drop(x, y, dropRadius, strength);
        }, 1000);
    }
    render() {
        return(
            <div>
                <VisualDom data={this.props.data}></VisualDom>
                <canvas className="ripple" id="ripple"></canvas>
            </div>
        );
    }
}

export default Visual;