import React, { Component } from 'react';
import * as actions from '../../action';
import { connect } from 'react-redux';
import axios from "axios";
import Visual from './visual/Visual';
import Item from './item/Item';

class List extends Component {
    constructor(props) {
        super(props);
        this.props.changeHeaderType('white'); // header 색상 변경
    }
    componentDidMount() {
        let language = this.props.language;

        // visual Data
        axios.get(`/json/${language}/visualData.json`)
            .then(response => {
                this.props.loadVisual(response.data.data);
            });
        // list Data
        axios.get(`/json/${language}/listData.json`)
            .then(response => {
                this.props.loadList(response.data.data);
            });
    }
    render() {
        return(
            <div id="container">
                <Visual data={this.props.visualData}></Visual>
                <Item data={this.props.listData}></Item>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {
      visualData: state.visualData,
      listData: state.listData,
      language: state.language,
      headerType: state.headerType
  }
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadVisual: (data) => { dispatch(actions.loadVisual(data)); },
        loadList: (data) => { dispatch(actions.loadList(data)); },
        changeHeaderType: (headerType) => { dispatch(actions.changeHeaderType(headerType)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);