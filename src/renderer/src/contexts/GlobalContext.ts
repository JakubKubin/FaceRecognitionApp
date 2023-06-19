import GlobalContextInterface from "@renderer/types/GlobalContextInterface";
import { createContext } from "react";

const GlobalContext = createContext<GlobalContextInterface | undefined>(undefined)
export default GlobalContext
