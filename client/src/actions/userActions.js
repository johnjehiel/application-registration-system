import {
    loginFail,
    loginRequest, 
    loginSuccess, 
    clearError,
    registerFail,
    registerRequest,
    registerSuccess,
    loadUserRequest,
    loadUserSuccess,
    loadUserFail,
    logoutSuccess,
    logoutFail,
} from '../slices/authSlice';

import axios from 'axios';

export const login = (email, password) => async (dispatch) => {

        try {
            dispatch(loginRequest())
            const { data }  = await axios.post(`${process.env.REACT_APP_SERVER_URL}/login`,{email,password});
            dispatch(loginSuccess(data))
        } catch (error) {
            dispatch(loginFail(error.response.data.message))
        }
}

export const clearAuthError = dispatch => {
    dispatch(clearError())
}

export const register = (userData) => async (dispatch) => {

    try {
        dispatch(registerRequest())
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }

        const { data }  = await axios.post(`${process.env.REACT_APP_SERVER_URL}/register`,userData, config);
        dispatch(registerSuccess(data))
    } catch (error) {
        dispatch(registerFail(error.response.data.message))
    }

}

export const loadUser =  async (dispatch) => {

    try {
        dispatch(loadUserRequest())
        const { data }  = await axios.get(`${process.env.REACT_APP_SERVER_URL}/getdata`);
        dispatch(loadUserSuccess(data))
    } catch (error) {
        dispatch(loadUserFail(error.response.data.message))
    }

}

export const logout =  async (dispatch) => {

    try {
        await axios.get(`${process.env.REACT_APP_SERVER_URL}/logout`);
        dispatch(logoutSuccess())
    } catch (error) {
        dispatch(logoutFail)
    }
}