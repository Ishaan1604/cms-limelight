import React, { useContext, useState } from 'react'

const AppContext = React.createContext

export const useGlobalContext = () => useContext(AppContext)

const AppProvider = ({children}) => {
    const [content, setContent] = useState(null);
    <AppContext.Provider value={{content, setContent}}>
        {children}
    </AppContext.Provider>
}

export {AppProvider}
