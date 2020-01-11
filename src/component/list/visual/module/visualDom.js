import React, { Component } from 'react';
import visualDomTitle from './visualDomTitle';
import visualDomBg from './visualDomBg';

class visualDom extends Component {
    componentDidMount() {
        this.visualDomTitle = new visualDomTitle({
            data: [],
            ele: document.getElementById('visualTitle'),
            intervalTime: 3
        });
        this.visualDomBg = new visualDomBg({
            ele: document.getElementById('visualBg'),
            intervalTime: 1
        });
    }
    componentDidUpdate() {
        this.makeTitle(this.props.data);
        this.makeBg();
    }
    makeTitle(data) {
        this.visualDomTitle.init(data);
    }
    makeBg() {
        this.visualDomBg.init();
    }
    render() {
        return(
            <section id="visual" className="visualDom">
                <div id="visualTitle" className="title"></div>
                <div id="visualBg" className="bg"></div>
            </section>
        )
    }
}

export default visualDom;