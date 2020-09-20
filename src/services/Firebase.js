import React, { useState, useEffect, createContext, useContext } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

import firebaseConfig from "./firebase.conf.private";

export const AuthContext = createContext();

let tokenRefreshInterval = null;

const useProviderAuth = () => {
    const [state, setState] = useState({
        isLoaded: false, // is the Firebase module fully loaded and initalized
        isAuthenticated: false // is there an active user session
    });
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    const login = (username, password) => firebase.auth().signInWithEmailAndPassword(username, password).catch(err => console.error(err));
    const logout = () => firebase.auth().signOut();

    useEffect(() => {
        firebase.initializeApp(firebaseConfig);
        const unsubscribe = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                setToken([user._lat, new Date().getTime()]);
                setUser(user);
            } else {
                setToken(null);
                setUser(false);
            };
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) return;
        tokenRefreshInterval = setInterval(() => {
            //if (tokenRefreshInterval && !state.isAuthenticated) return clearInterval(tokenRefreshInterval);
            firebase.auth().currentUser.getIdToken(true).then(token => {
                setToken([token, new Date().getTime()]);
            });
        }, 10 * 60 * 1000);
        return () => clearInterval(tokenRefreshInterval);
    }, [user, state.isAuthenticated]);

    useEffect(() => {
        setState({
            isLoaded: (user !== null) ? true : false,
            isAuthenticated: (user && token) ? true : false,
            user,
            token
        });
    }, [user, token]);

    return [{
        user,
        token,
        ...state
    }, {
        login,
        logout
    }]
};

export default ({fallback, children}) => {
    const [state, actions] = useProviderAuth();

    if (fallback && !state.isLoaded) return fallback;

    return (
        <AuthContext.Provider value={[state, actions]}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => useContext(AuthContext);