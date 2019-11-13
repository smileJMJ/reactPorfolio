import React, { Component} from 'react';
import { connect } from 'react-redux';
import  * as actionTypes from '../action';
import axios from 'axios';

class View extends Component {
    getViewData(id) {
        console.log(id)
        let data;
        axios.get(`/json/viewData${id}.json`)
            .then(response => {
                data = response;
                this.props.loadView(id, data);
            })
            .catch(e => {
                data = '해당 데이터가 없습니다.'
            });
        return data;
    }
    render() {
        return(
            <div>{this.getViewData(this.props.match.params.id)}</div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.id
    };
};
const mapDispatchToProps = (dispatch) => {
    return {
        loadView: (id, data) => { dispatch(actionTypes.loadView(id, data)); }
    }
};

export default connect(mapStateToProps)(View);