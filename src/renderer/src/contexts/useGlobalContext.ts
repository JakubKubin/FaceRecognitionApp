import GlobalContext from "./GlobalContext"
import { useContext } from "react"

const useGlobalContext = () => useContext(GlobalContext)
export default useGlobalContext