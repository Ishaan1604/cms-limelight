import React, { useContext, useState } from 'react'

const AppContext = React.createContext();


const AppProvider = ({children}) => {
    const [content, setContent] = useState(null);
    return (<AppContext.Provider value={{content, setContent}}>
        {children}
    </AppContext.Provider>)
}

export const useGlobalContext = () => useContext(AppContext)

export {AppProvider}
