import React, { useRef } from 'react';
import { useAuth } from './services/Firebase';

export default () => {
    const [AuthContext, AuthFunctions] = useAuth();
    const fieldUsername = useRef(null);
    const fieldPassword = useRef(null);

    const doLogin = () => {
        AuthFunctions.login(fieldUsername.current.value, fieldPassword.current.value);
    };

    const doLogout = () => {
        AuthFunctions.logout();
    };

    return (
        <React.Fragment>
            <pre>
                {(AuthContext.isAuthenticated) ? (
                    <button onClick={doLogout}>Logout</button>
                ) : (
                    <React.Fragment>
                        <input type="text" placeholder="username" ref={fieldUsername} />
                        <input type="password" placeholder="password" ref={fieldPassword} />
                        <button onClick={doLogin}>Login</button>
                    </React.Fragment>
                )}
            </pre>
            <pre>{JSON.stringify(AuthContext, null, 2)}</pre>
        </React.Fragment>
    );
};