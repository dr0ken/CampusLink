import { createContext } from "react";

export const userContext = createContext()

const ContextProvider = ({children}) => {
  const authenticated = true;

  return (
    <userContext.Provider value={{authenticated}}>
      {children}
    </userContext.Provider>
  )
}

export default ContextProvider