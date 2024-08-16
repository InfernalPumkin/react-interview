import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './reducer';

const store = configureStore({
    reducer: moviesReducer,
});

export default store;
export const dispatch = store.dispatch;
