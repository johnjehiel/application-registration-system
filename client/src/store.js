import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { thunk } from "redux-thunk";
// import thunk from "redux-thunk";
import authReducer from './slices/authSlice';


const reducer = combineReducers({
    authState: authReducer
})


const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
    // middleware: [thunk]
})

export default store;