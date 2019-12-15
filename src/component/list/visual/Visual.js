import React, { Component } from 'react';
import axios from 'axios';
//import VisualCanvas from './VisualCanvas';
import Canvas from './module/canvas';
import styles from './visual.module.css';

class Visual extends Component {
    /*constructor(props) {
        super(props);
        this.state = {
            visualData: []
        }
    }*/
    componentDidMount() {
        let visualCanvas, canvas;

        visualCanvas = document.getElementById('visual');
        visualCanvas.width = visualCanvas.clientWidth;
        visualCanvas.height = visualCanvas.clientHeight;

        axios.get('/json/visualData.json')
            .then(response => {
                /*this.setState({
                    visualData: response.data.data
                });*/
                canvas = new Canvas(visualCanvas, response.data.data);
                canvas.init();
            });
    }
    render() {
        return(
            <div className="visualArea">
                {/*<VisualCanvas data={this.state.visualData}></VisualCanvas>*/}
                <canvas className={styles.visual} id="visual"></canvas>
            </div>
        );
    }
}

export default Visual;