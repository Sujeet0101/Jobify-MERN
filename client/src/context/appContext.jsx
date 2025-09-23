import React, { useReducer, useContext} from "react"
import reducer from "./reducers"
import { DISPALY_ALERT, CLEAR_ALERT, REGISTER_USER_BEGIN, REGISTER_USER_SUCCESS, REGISTER_USER_ERROR } from "./actions";


const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
    user: null,
    token: null,
    userLocation: "",
}

const AppContext = React.createContext();

const AppProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const displayAlert = () => {
        dispatch({type: DISPALY_ALERT})
        cleartAlert()
    }

    const cleartAlert = () => {
        setTimeout(() => {
            dispatch({
              type: CLEAR_ALERT,
            });
        }, 3000)
        
    }

    const registerUser = async (currrentUser) => {
        console.log(currrentUser)
    }

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        registerUser
    }}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext);
}

export {AppProvider, initialState, useAppContext}