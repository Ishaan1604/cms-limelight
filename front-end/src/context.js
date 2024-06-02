import React, { useContext, useState } from 'react'

const AppContext = React.createContext();


const AppProvider = ({children}) => {
    const [content, setContent] = useState(null);
    const [error, setError] = useState({err: false, msg: null});
    return (<AppContext.Provider value={{content, setContent, error, setError}}>
        {children}
    </AppContext.Provider>)
}

export const useGlobalContext = () => useContext(AppContext)

export {AppProvider}
