import useGlobalContext from "@renderer/contexts/useGlobalContext"
import { useEffect, useState } from "react"
import Button from "./Button"


// interface ModalInterface{
//     title:string,
//     content: JSX.Element
// }

export default function Modal(){

    const globalContext = useGlobalContext()
    const [faces, setFaces] = useState<string[]>()
    const [selectedFaces, setSelectedFaces] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        (async() => {
            if(!globalContext) return
            if(globalContext.selectedPhotoPath === "") return
            
            const response = await window.electron.findFaces(globalContext.selectedPhotoPath)
            if(Object.values(JSON.parse(response)).length === 0)  globalContext.setSelectedPhotoPath("")
            setFaces(Object.values(JSON.parse(response)).map((obj:any) => obj.face) as string[])


        })()
    }, [globalContext?.selectedPhotoPath])

    const clear = () => {
        if(!globalContext) return
        setFaces([])
        setSelectedFaces([])
        globalContext.setSelectedPhotoPath("")
    }

    const handleSelect = (id:number) => {
        const foundValue = selectedFaces.find(value => value === id)
        if(foundValue === undefined){
            setSelectedFaces(prev => [...prev, id])
            return
        }
        
        setSelectedFaces(selectedFaces.filter(value => value !== foundValue))
    }

    const runFilter = async() => {
        if(globalContext && selectedFaces.length > 0 && faces && faces.length > 0){
            setIsLoading(true)
            const response = await window.electron.recognizeFaces(selectedFaces.map((index) => faces[index]))
            const {paths} = JSON.parse(response)
            setIsLoading(false)

            clear()
            globalContext.setPhotoPaths(paths)
        }
    }


    if(globalContext && faces && faces?.length > 0) return(
        <div className="backdrop-blur-sm fixed left-0 top-0 w-screen h-screen">
        <div className="
        fixed w-1/2 h-1/2 left-1/4 top-1/4 bg-neutral-400
        rounded
        flex flex-col items-center
        ">
            <div className="flex flex-row items-center justify-center gap-2 m-4 select-none flex-wrap overflow-y-auto">
            {
                faces?.map((face, index) => 
                    <div onClick={() => {handleSelect(index)}} className={
                        `
                        flex items-center justify-center
                        w-36 h-36 
                        rounded
                        p-2 
                        ${selectedFaces.find(value => value === index) !== undefined ? "bg-green-500 hover:bg-green-700" : "bg-gray-200 hover:bg-blue-200" }
                        
                        `
                    }
                    key={index}>
                        <img className="max-w-full max-h-full" src={"data:image/png;base64," + face} />
                    </div>
                )
            }
            </div>
            <div className="flex gap-3 p-2">
                <Button title="Filter" onClick={runFilter} />
                <Button title="Close" onClick={clear} />
            </div>
            { isLoading &&
                <>
                <br />
                <p>Please wait...</p>
                </>
            }
        </div>

        </div>
    )

    return(<></>)
}