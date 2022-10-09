import classes from './ProfileForm.module.css';
import {useContext, useRef, useState} from "react";
import AuthContext from "../../store/auth-context";
import {useNavigate} from "react-router-dom";

const ProfileForm = () => {
    const navigate = useNavigate();

    const newPasswordRef = useRef();

    const {token} = useContext(AuthContext);

    const changePasswordHandler = async (event) => {
        event.preventDefault();
        const newEnteredPassword =newPasswordRef.current.value;

        try {
            const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCCv9p4SEWJKbVkOPM5e8W9n-RzFaofv84', {
                method: 'POST',
                body: JSON.stringify({
                    idToken: token,
                    password: newEnteredPassword,
                    returnSecureToken: false
                }),
                headers: {
                    'Content-Type': 'application/json'
                }

            });
            const data = await response.json();
            if (!response.ok) {
                let error = data.error.message;
                throw new Error(error);
            }else {
                alert(`Password Of ${data.email} Successfully Changed!`);
                navigate('/');
            }
        } catch (e) {
            alert(e.message);
        }
    }
    return (
        <form className={classes.form} onSubmit={changePasswordHandler}>
            <div className={classes.control}>
                <label htmlFor='new-password'>New Password</label>
                <input type='password' id='new-password' ref={newPasswordRef}/>
            </div>
            <div className={classes.action}>
                <button>Change Password</button>
            </div>
        </form>
    );
}

export default ProfileForm;
