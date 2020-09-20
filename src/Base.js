import React, { useContext, useRef } from 'react';
import { FirebaseServiceContext } from './services/Firebase';

export default () => {
    const [ UserContext, UserFunctions ] = useContext(FirebaseServiceContext);
    const fieldUsername = useRef(null);
    const fieldPassword = useRef(null);

    const doLogin = () => {
        UserFunctions.login(fieldUsername.current.value, fieldPassword.current.value);
    };

    const doLogout = () => {
        UserFunctions.logout();
    };

    return (
        <React.Fragment>
            <pre>
                <input type="text" placeholder="username" ref={fieldUsername} />
                <input type="password" placeholder="password" ref={fieldPassword} />
                <button onClick={doLogin}>Login</button>
                <button onClick={doLogout}>Logout</button>
            </pre>
            <pre>{JSON.stringify(UserContext, null, 2)}</pre>
        </React.Fragment>
    );
};