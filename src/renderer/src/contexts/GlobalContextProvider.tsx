import { PropsWithChildren, useState } from "react"
import Path from "../types/Path"
import GlobalContext from "./GlobalContext"

const GlobalContextProvider = ({children}:PropsWithChildren) => {

    const [galleryPath, setGalleryPath] = useState<Path>("")
    const [photoPaths, setPhotoPaths] = useState<Path[]>([])
    const [selectedPhotoPath, setSelectedPhotoPath] = useState<Path>("")

    return (
        <GlobalContext.Provider value={{galleryPath, photoPaths, selectedPhotoPath, setGalleryPath, setPhotoPaths, setSelectedPhotoPath}}>
            {children}
        </GlobalContext.Provider>
    )

}

export default GlobalContextProvider