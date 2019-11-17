import React from 'react';
import { Link } from 'react-router-dom';

const List = (props) => (
    <ul>
        {
            props.data.map((v, i) => {
                return <li key={v.id}><Link to={`/view/${v.id}`}>{v.title}</Link></li>
            })
        }
    </ul>
);

export default List;