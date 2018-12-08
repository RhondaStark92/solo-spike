import React, { Component } from 'react';
import { connect } from 'react-redux';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

const mapStateToProps = reduxState => ({
    reduxState,
});

const SortableItem = SortableElement(({value}) =>
  <ListItem>{value.name}</ListItem>
);

const SortableList = SortableContainer(({items}) => {
    return (
        <List>
        {items.map((value, index) => (
          <SortableItem key={`item-${index}`} index={index} value={value} />
        ))}
      </List>
    );
  });
  
//   class SortableComponent extends Component {
//     render() {
//     //   return <SortableList items={this.props.reduxState.plantList} onSortEnd={this.props.onSortEnd}/>;
//     return <SortableList items={this.props.reduxState.plantList}/>;
//     }
//   }

class PlantList extends Component {

    handleClick = (id) => {
        this.props.dispatch({ type: 'DELETE_PLANT', payload: id})
    }

    componentDidMount() {
        // use component did mount to dispatch an action to request the plantList from the API
        this.props.dispatch({ type: 'GET_PLANTS'})
    }

    onSortEnd = ({oldIndex, newIndex}) => {    
        this.props.dispatch({ type: 'REORDER_LIST', payload: {oldIndex, newIndex}})
        this.props.dispatch({ type: 'UPDATE_ORDER', payload: {oldIndex, newIndex}})
    };

    saveOrder = () => {
        // this will call the saga for refreshing the database?
    }

    render() {
        // const {data} = this.props;
        // const {list} = data;
        return (
            <div>
                <h3>This is the plant list</h3>
                <SortableList items={this.props.reduxState.plantList} 
                                    onSortEnd={this.onSortEnd}/>
                <button onClick={this.saveOrder}>Save Order</button>
            </div>
        );
    }
}

export default connect(mapStateToProps)(PlantList);
