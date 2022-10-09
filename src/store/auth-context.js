import React from "react";

const defaultAuthContext = {
    token : '',
    isLoggedIn : false,
    login : (token) => {},
    logout : () => {}
};

const AuthContext = React.createContext(defaultAuthContext);

export default AuthContext;