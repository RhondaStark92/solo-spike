import React, { Component } from 'react';
import { connect } from 'react-redux';

const mapStateToProps = reduxState => ({
    reduxState,
});

const emptyPlantObject = {
    name: '',
    kingdom: '',
    clade: '',
    order: '',
    family: '',
    subfamily: '',
    genus: '',
    rank: 0,
}

class NewPlantForm extends Component {

    state = {newPlant: emptyPlantObject};

    handleNameChange = event => {
        console.log('event happended')
        this.setState({
            newPlant: {
                ...this.state.newPlant,
                [event.target.name]: event.target.value,
            }
        });
    }

    addNewPlant = event => {
        event.preventDefault();
        this.props.dispatch({ type: 'ADD_PLANT', payload: this.state.newPlant });
        this.setState({
            newPlant: emptyPlantObject
        });
    }

    render() {
        return (
            <div>
                <h3>This is the form</h3>
                {/* <pre>{JSON.stringify(this.state)}</pre> */}
                <form onSubmit={this.addNewPlant}>
                    <input type='text' name="name" placeholder="name" value={this.state.newPlant.name} onChange={this.handleNameChange} />
                    <input type='text' name="kingdom" placeholder="kingdom" value={this.state.newPlant.kingdom} onChange={this.handleNameChange} />
                    <input type='text' name="clade" placeholder="clade" value={this.state.newPlant.clade} onChange={this.handleNameChange} />
                    <input type='text' name="order" placeholder="order" value={this.state.newPlant.order} onChange={this.handleNameChange} />
                    <input type='text' name="family" placeholder="family" value={this.state.newPlant.family} onChange={this.handleNameChange} />
                    <input type='text' name="subfamily" placeholder="subfamily" value={this.state.newPlant.subfamily} onChange={this.handleNameChange} />
                    <input type='text' name="genus" placeholder="genus" value={this.state.newPlant.genus} onChange={this.handleNameChange} />
                    <input type='submit' value='Add New Plant' />
                </form>
            </div>
        );
    }
}


export default connect(mapStateToProps)(NewPlantForm);
