import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery } from 'redux-saga/effects';
import App from './App';
import {arrayMove} from 'react-sortable-hoc';

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

function* getPlants(action) {
  try {
      // need to send the action.payload to the /api/giphy
      const response = yield call(axios.get, '/api/plant')
      console.log('api plant call', response);
      yield put ( {type: 'PUT_PLANT', payload: response.data });
  }
  catch (error) {
        console.log('error with get request to /api/plant', error);
  }
}

function* addPlant(action) {
  console.log('in post saga for adding a plant', action.payload);
  try {
      // axios asynch call to add plant to server
      yield call(axios.post, '/api/plant', action.payload);
      yield put( { type: 'GET_PLANTS' } );
  }
  catch (error) {
      console.log('error with add post request to /api/plant');
  }
}

function* deletePlant(action) {
  console.log('in delete saga', action.payload);
  try {
    //axios call to remove plant
    yield call(axios.delete, '/api/plant', {params: {id: action.payload}});
    yield put( { type: 'GET_PLANTS' } );
  }
  catch (error) {
    console.log('error with delete plant request to /api/plant');
    
  }
  
}

function* updatePlantOrder(action) {
  let from=action.payload.oldIndex + 1;
  let to=action.payload.newIndex + 1;
  console.log('in updatePlantOrders,', from, to);
  
  try {
    //axios call to update plant ordering
    console.log('in try of update');
    yield call(axios.put, '/api/plant/order1', {params: {old: from, new: to}});
    yield call(axios.put, '/api/plant/order2', {params: {old: from, new: to}});
    yield call(axios.put, '/api/plant/order3', {params: {old: from, new: to}});
    yield put( { type: 'GET_PLANTS'} );
  }
  catch (error) {
    console.log('error with update plant request to /api/plant');
    
  }
}

// Create the rootSaga generator function
function* rootSaga() {
  yield takeEvery('GET_PLANTS', getPlants);
  yield takeEvery('ADD_PLANT', addPlant);
  yield takeEvery('DELETE_PLANT', deletePlant);  
  yield takeEvery('UPDATE_ORDER', updatePlantOrder)
}

// This function (our reducer) will be called when an 
// action is dipatched. 
const plantList = (state = [], action) => {
  switch (action.type) {
      case 'PUT_PLANT':
          return action.payload;
      case 'REORDER_LIST':
          console.log('in reorder list', action.payload);
          return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);
      default:
          return state;
  }
}

const store = createStore(
  combineReducers(
    {plantList,
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('react-root'));
