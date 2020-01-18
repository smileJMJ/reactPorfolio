import React, { Component } from 'react';
import * as actions from '../../action';
import { connect } from 'react-redux';
import Visual from './visual/Visual';
import Item from './item/Item';

class List extends Component {
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
      listData: state.listData
  }
};

export default connect(mapStateToProps)(List);