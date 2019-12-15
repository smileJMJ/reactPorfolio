import React, { Component } from 'react';

class VisualCanvas extends Component {
    componentDidUpdate() {
        console.log(this.props);
    }
    render() {
        console.log('render')
        return(
            <canvas id="visual"></canvas>
        )
    }
}

export default VisualCanvas;