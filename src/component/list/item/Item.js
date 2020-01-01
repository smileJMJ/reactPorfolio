import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Item extends Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.data !== nextProps.data) return true;
        return false;
    }
    render() {
        return(
            <div className="itemArea">
                <div className="inner">
                    <ul>
                        {
                            this.props.data.map((v, i) => {
                                return <li key={v.id}><Link to={`/view/${v.id}`}>{v.title}</Link></li>;
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Item;