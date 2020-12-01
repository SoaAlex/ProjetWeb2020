import React from 'react';

export const ChannelContext = React.createContext({
    channel: [{id: 0, name: 'channel 0'}],
    setChannelContext: () => {}
})