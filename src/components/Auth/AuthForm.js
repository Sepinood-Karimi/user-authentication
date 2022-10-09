import {useContext, useRef, useState} from 'react';

import classes from './AuthForm.module.css';
import {useNavigate} from "react-router-dom";
import AuthContext from "../../store/auth-context";

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading,setIsLoading] = useState(false);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();

    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);

    const switchAuthModeHandler = () => {
        setIsLogin((prevState) => !prevState);
    };

    const submitFormHandler = async (event) => {
        event.preventDefault();
        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        let url;
        if (isLogin){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCCv9p4SEWJKbVkOPM5e8W9n-RzFaofv84'
        }else {
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCCv9p4SEWJKbVkOPM5e8W9n-RzFaofv84'
        }
        try{
            setIsLoading(true);
            const response = await fetch(url,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        email: enteredEmail,
                        password: enteredPassword,
                        returnSecureToken: true
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            setIsLoading(false);
            const data = await response.json();
            if (data.registered){
                alert(`You Successfully Logged In with ${enteredEmail}!`);
            }else{
                alert(`your account with ${enteredEmail} created!`)
            }
            if (response.ok){
                const expTime = new Date(new Date().getTime() +(+data.expiresIn *1000));
                authCtx.login(data.idToken,expTime.toISOString())
                navigate('/',{replace:true})
            }else {
                let error = data.error.message;
                throw new Error(error);
            }
        }catch (e) {
            alert(e.message);
        }
    }


    return (
        <section className={classes.auth}>
            <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
            <form onSubmit={submitFormHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailInputRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' required ref={passwordInputRef}/>
                </div>
                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    {isLoading && <button> Is Loading ... </button>}
                    <button
                        type='button'
                        className={classes.toggle}
                        onClick={switchAuthModeHandler}
                    >
                        {isLogin ? 'Create new account' : 'Login with existing account'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;
