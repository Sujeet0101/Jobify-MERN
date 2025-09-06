import React, { useReducer, useContext} from "react"
import reducer from "./reducers"
import { DISPALY_ALERT, CLEAR_ALERT } from "./actions";


const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: "",
    alertType: "",
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

    return <AppContext.Provider value={{
        ...state,
        displayAlert,
    }}>
        {children}
    </AppContext.Provider>
}

const useAppContext = () => {
    return useContext(AppContext);
}

export {AppProvider, initialState, useAppContext}