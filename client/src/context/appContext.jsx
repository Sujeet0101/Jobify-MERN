import React, { useReducer, useContext } from "react";
import reducer from "./reducers";
import axios from "axios";
import {
  DISPALY_ALERT,
  CLEAR_ALERT,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from "./actions";

const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
const userLocation = localStorage.getItem("location");

const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
  showSidebar: false,
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //axios
  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  //request
  authFetch.interceptors.request.use(
    (config) => {
      // Make sure headers exists
      //config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${state.token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  //response
  authFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      //console.log(error.response);
      if (error.response.status === 401 || error.response.status === 500) {
        logoutUser();
      }
      return Promise.reject(error);
    }
  );

//   authFetch.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     (error) => {
//       if (error.response) {
//         console.log(error.response);
//         if (error.response.status === 401) {
//           console.log("AUTH ERROR");
//         }
//       } else {
//         console.log("Network/Server error:", error.message);
//       }
//       return Promise.reject(error);
//     }
//   );


  const displayAlert = () => {
    dispatch({ type: DISPALY_ALERT });
    cleartAlert();
  };

  const cleartAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 3000);
  };

  const addUserToLocalStorage = ({ user, token, location }) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  const removeUserFromLocalStorage = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("location");
  };

  const registerUser = async (currrentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", currrentUser);
      //console.log(response)
      const { user, token, location } = response.data;
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, token, location },
      });
      // local storage
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      //console.log(error.response)
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    cleartAlert();
  };

  const loginUser = async (currrentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const { data } = await axios.post("/api/v1/auth/login", currrentUser);

      const { user, token, location } = data;
      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, token, location },
      });

      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    cleartAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const updateUser = async (currentUser) => {
    dispatch({type: UPDATE_USER_BEGIN})
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);

      const {user, location, token} = data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user,location, token}
      })
      addUserToLocalStorage({user, location, token})
    } catch (error) {
      if(error.response.status !== 401 || error.response.status !== 500) {
        dispatch({
          type: UPDATE_USER_ERROR,
          payload: { msg: error.response.data.msg },
        });
      }
      
    }
    cleartAlert()
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState, useAppContext };
