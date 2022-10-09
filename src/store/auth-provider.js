import AuthContext from "./auth-context";
import {useState} from "react";


const AuthProvider = ({children}) => {
    const [token,setToken] = useState('');
    const isLoggedIn = !!token;

    const loginHandler = (token) => {
        setToken(token);
    };
    const logoutHandler = () => {
        setToken(null);
    };

    const authValue = {
        token ,
        isLoggedIn,
        login : loginHandler,
        logout : logoutHandler
    }

    return(
      <AuthContext.Provider value={authValue}>
          {children}
      </AuthContext.Provider>
    );
};

export default AuthProvider;