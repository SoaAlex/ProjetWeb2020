import React from 'react';

export const ChannelsContext = React.createContext({
    channels: [{id: 0, name: 'channel 0'}],
    setChannelsContext: (channels) => {}
})