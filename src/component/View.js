import React, { Component} from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {}
        }
    }
    getViewData() {
        let data;
        axios.get(`/json/viewData${this.props.match.params.idx}.json`)
            .then(response => {
                data = response;
                this.state.setState({

                })
            })
            .catch(e => {
                data = '해당 데이터가 없습니다.'
            });
        return data;
    }
    render() {
        return(
            <div>{this.getViewData()}</div>
        );
    }
}

const mapStateToProps = (state) => {
    return { mode: 'view' };
};

export default connect(mapStateToProps)(View);