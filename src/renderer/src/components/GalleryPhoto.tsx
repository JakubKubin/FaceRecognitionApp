import useGlobalContext from "@renderer/contexts/useGlobalContext"
import { useEffect, useState } from "react"

interface GalleryPhotoInterface{
    url:string
}

export default function GalleryPhoto({url}:GalleryPhotoInterface){

    const globalContext = useGlobalContext()
    const [selected, setSelected] = useState<boolean>(false)

    useEffect(() => {
        if(globalContext?.selectedPhotoPath === "") setSelected(false)
    }, [globalContext?.selectedPhotoPath])
 
    const handleClick = (event:React.MouseEvent) => {

        if(!globalContext) return
        if(globalContext.selectedPhotoPath !== "") return

        if(event.detail >= 2){
            setSelected(true)
            globalContext.setSelectedPhotoPath(url)
            // open modal
        }

    }

    return(
        <div onClick={handleClick} className={`
        w-36 h-36 
        ${selected ? "bg-green-500" : "bg-neutral-300"} 
        flex items-center 
        justify-center p-1 
        hover:bg-neutral-600
        rounded
        `
        }>
            <img className="max-w-full max-h-full" src={"atom://" + url} />
        </div>
    )

}