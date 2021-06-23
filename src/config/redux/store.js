const { createStore } = require("redux");

const initialState = {
    loginStatus: false,
    dataUser: null
}

const reducer = (state = initialState, action) => {
    if(action.type === 'UPDATE_LOGIN_STATUS'){
        return{
            ...state,
            loginStatus: action.payload
        }
    }
    if(action.type === 'UPDATE_DATA_USER'){
        return{
            ...state,
            dataUser: action.payload
        }
    }
    return state;
}

const store = createStore(reducer);

export default store;