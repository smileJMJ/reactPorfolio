import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class List extends Component {
    makeList(data = []) {
        let t = [];
        if(data.length <= 0) return;
        data.map((v, i) => (
            t[i] = <li key={v.idx}><Link to={`/view/${v.idx}`}>{v.title}</Link></li>
        ));
        return t;
    }
    render() {
        return(
            <ul>
                {this.makeList(this.props.data)}
            </ul>
        );
    }
}

export default List;