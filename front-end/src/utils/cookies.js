export const eraseCookie = (name) => {   
    document.cookie = name+'=; Max-Age=-99999999;';  
}

export const getCookie = (name) => {   
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}