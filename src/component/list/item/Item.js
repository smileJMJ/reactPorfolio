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
                                return (
                                    <li key={v.id}>
                                        <Link to={`/view/${v.id}`}>
                                            <figure><img src={v.thumb} alt=""/></figure>
                                            <dl>
                                                <dt>{v.title}</dt>
                                                <dd>{v.contents}</dd>
                                            </dl>
                                        </Link>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

export default Item;