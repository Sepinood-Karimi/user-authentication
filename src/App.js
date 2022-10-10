import React,{Suspense} from "react";
import {Route, Routes} from 'react-router-dom';

import Layout from './components/Layout/Layout';
import {useContext} from "react";
import AuthContext from "./store/auth-context";

const UserProfile = React.lazy(()=>import('./components/Profile/UserProfile'));
const AuthPage = React.lazy(()=>import('./pages/AuthPage'));
const HomePage = React.lazy(()=>import('./pages/HomePage'));

function App() {
    const authCtx = useContext(AuthContext);
    const isLoggedIn = authCtx.isLoggedIn;

    return (
        <Suspense fallback={<p> Loading ... </p>}>
            <Layout>
                <Routes>
                    <Route path='/' element={<HomePage/>}/>
                    {!isLoggedIn && <Route path='/auth' element={<AuthPage/>}/>}
                    <Route path='/profile' element={isLoggedIn ? <UserProfile/> : <AuthPage/>}/>
                    <Route path='*' element={<HomePage/>}/>
                </Routes>
            </Layout>
        </Suspense>
    );
}

export default App;
