import React, { useState, useEffect, createContext } from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

import firebaseConfig from "./firebase.conf.private";

export const FirebaseServiceContext = createContext();

const FirebaseFunctions = {
    login: (username, password) => firebase.auth().signInWithEmailAndPassword(username, password).catch(err => console.error(err)),
    logout: () => firebase.auth().signOut()
};
let FirebaseTokenRefreshInterval = null;

export default ({fallback, children}) => {
    const [state, setState] = useState({
        isLoaded: false, // is the Firebase module fully loaded and initalized
        isAuthenticated: false // is there an active user session
    });
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    
    useEffect(() => {
        firebase.initializeApp(firebaseConfig);
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                setToken(null);
                setUser(false);
            } else {
                setToken([user._lat, new Date().getTime()]);
                setUser(user);
            };
        });
    }, []);

    useEffect(() => {
        if (!user) return;
        FirebaseTokenRefreshInterval = setInterval(() => {
            //if (refreshToken && !state.isAuthenticated) return clearInterval(refreshToken);
            firebase.auth().currentUser.getIdToken(true).then(token => {
                setToken([token, new Date().getTime()]);
            });
        }, 10 * 60 * 1000);
        return () => clearInterval(FirebaseTokenRefreshInterval);
    }, [user, state.isAuthenticated]);

    useEffect(() => {
        setState({
            isLoaded: (user !== null) ? true : false,
            isAuthenticated: (user && token) ? true : false,
            user,
            token
        });
    }, [user, token]);

    if (fallback && !state.isLoaded) return fallback;

    return (
        <FirebaseServiceContext.Provider value={[state, FirebaseFunctions]}>
            {children}
        </FirebaseServiceContext.Provider>
    )
};