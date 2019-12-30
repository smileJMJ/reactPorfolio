import React, { Component } from 'react';
import axios from 'axios';
//import VisualCanvas from './VisualCanvas';
import Canvas from './module/canvas';
import Ripple from './module/Ripple';
import VisualDom from './module/visualDom';
import styles from './visual.module.css';

class Visual extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visualData: []
        }
    }
    componentDidMount() {
        let visualCanvas, canvas;
        let rippleCanvas, ripple;

        visualCanvas = document.getElementById('visual');
        visualCanvas.width = visualCanvas.clientWidth;
        visualCanvas.height = visualCanvas.clientHeight;

        rippleCanvas = document.getElementById('ripple');
        rippleCanvas.width = visualCanvas.clientWidth;
        rippleCanvas.height = visualCanvas.clientHeight;

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

        axios.get('/json/visualData.json')
            .then(response => {
                this.setState({
                    visualData: response.data.data
                });
                /*canvas = new Canvas(visualCanvas, response.data.data);
                canvas.init();*/
            });
    }
    render() {
        return(
            <div>
                {/*<VisualCanvas data={this.state.visualData}></VisualCanvas>*/}
                {/*<canvas className={styles.visual} id="visual"></canvas>*/}
                <VisualDom data={this.state.visualData}></VisualDom>
                <canvas className={styles.ripple} id="ripple"></canvas>
            </div>
        );
    }
}

export default Visual;