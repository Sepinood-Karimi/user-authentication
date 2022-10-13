import AuthContext from "./auth-context";
import {useCallback, useEffect, useState} from "react";

let logoutTimer;

const calculateRemainingTime = (expTime) => {
    const currentTime = new Date().getTime();
    const adjExpTime = new Date(expTime).getTime();
    const remainingDuration = adjExpTime - currentTime;
    return remainingDuration;
};

const checkTokenValidation = () => {
    const storedToken = localStorage.getItem('token');
    const storedExpTime = localStorage.getItem('expTime');
    const remainingTime = calculateRemainingTime(storedExpTime);
    if (remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expTime');
        return null;
    }
    return {
        token: storedToken,
        remainingTime
    }

}
const AuthProvider = ({children}) => {
    const tokenData = checkTokenValidation();
    let initialToken;
    if (initialToken){
        initialToken = tokenData.token;
    }
    const [token, setToken] = useState(initialToken);
    const isLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expTime');
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
    },[]);
    const loginHandler = (token, expTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expTime', expTime);
        const remainingTime = calculateRemainingTime(expTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        try{
            const token = localStorage.getItem('token');
            const expTime = localStorage.getItem('expTime');

            if(token && expTime && new Date(expTime) > new Date){
                setToken(token);
            }
        }catch (e){

        }
    }, []);

    useEffect(()=>{
        if (tokenData){
            logoutTimer = setTimeout(logoutHandler,tokenData.remainingTime)
        }
    },[tokenData,logoutHandler])

    const authValue = {
        token,
        isLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={authValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;