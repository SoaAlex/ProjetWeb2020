import React from 'react';

export const LoggedInContext = React.createContext({
    loggedIn: false,
    setLoggedInContext: (loggedIn) => {}
})