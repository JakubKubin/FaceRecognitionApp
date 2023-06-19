import GalleryPhoto from "./GalleryPhoto";
import harold from "../assets/haroldtest.jpg"

import useGlobalContext from "@renderer/contexts/useGlobalContext";

export default function Gallery(){
    const globalContext = useGlobalContext()

    
    if(globalContext && globalContext.photoPaths.length > 0) return(
        <div className="w-full flex flex-row flex-wrap justify-center rounded bg-neutral-500 p-3 overflow-y-auto gap-2 select-none">
            {globalContext?.photoPaths.map((path, index) => 
                <GalleryPhoto url={path} key={index} />
            )}
        </div>
    )

    return(
        <></>
    )
}