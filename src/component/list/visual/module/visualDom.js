import React, { Component } from 'react';
import visualDomTitle from './visualDomTitle';
import visualDomBg from './visualDomBg';
import styles from '../visual.module.css';

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
            <section id="visual" className={styles.visualDom}>
                <div id="visualTitle" className={styles.title}>
                    {/*<h1></h1>*/}
                    {/*<p>2019.03 ~ 2019.05</p>*/}
                </div>
                {/*<figure className={styles.video}>
                    <video muted autoPlay loop>
                        <source src="/images/visual/sea.mp4"/>
                    </video>
                </figure>*/}
                <div id="visualBg" className={styles.bg}></div>
            </section>
        )
    }
}

export default visualDom;