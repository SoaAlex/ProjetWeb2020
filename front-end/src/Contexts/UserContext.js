import React from 'react';

export const UserContext = React.createContext({
        user: null,
        setUserContext: (user) => {}
});