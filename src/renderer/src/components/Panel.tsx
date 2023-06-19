import useGlobalContext from "@renderer/contexts/useGlobalContext"
import Button from "./Button"
import { useEffect, useState } from "react"
import Path from "@renderer/types/Path"

type Emotion = "default" | "happy" | "neutral" | "sad" | "angry"
export default function Panel(){

    const globalContext = useGlobalContext()

    const [defaultPhotoPaths, setDefaultPhotoPaths] = useState<Path[]>([])
    const [selectedEmotion, setSelectedEmotion] = useState<Emotion>("default")

    const [indoorIsChecked, setIndoorIsChecked] = useState(false);
    const [outdoorIsChecked, setOutdoorIsChecked] = useState(false);
    const [pathsHistory, setPathsHistory] = useState<Path[][]>([])

    useEffect(() => {
        if(!globalContext) return
        setPathsHistory(prev => [...prev, globalContext.photoPaths])
    }, [globalContext?.photoPaths])


    const handleOpenFolder = async() => {
        const {canceled, photoPaths} = await window.electron.buttonFolder()
        if(canceled) return
        globalContext?.setPhotoPaths(photoPaths)
        setDefaultPhotoPaths(photoPaths)
    }

    const handleDefault = () => {
        if(!globalContext) return
        globalContext.setPhotoPaths(defaultPhotoPaths)
    }

    const handleFilter = async() => {
        if(globalContext && globalContext.photoPaths.length > 0){

            const input = {
                paths: globalContext.photoPaths,
                backgrounds: [] as string[],
                emotion: selectedEmotion
            }
            if(indoorIsChecked) input.backgrounds.push("indoor")
            if(outdoorIsChecked) input.backgrounds.push("outdoor")

            const response = await window.electron.filterImages(input)

            // console.log(Object.keys(JSON.parse(response)))
            const data = JSON.parse(response)

            globalContext.setPhotoPaths(data.paths)
        }
    }

    const handleSave = async() => {
        if(globalContext && globalContext.photoPaths.length > 0){
            const response = await window.electron.saveImages(globalContext.photoPaths)
            console.log(response)
        }
    }

    const handleIndoorCheckbox = () => {
        setIndoorIsChecked(!indoorIsChecked)
    }
    const handleOutdoorCheckbox = () => {
        setOutdoorIsChecked(!outdoorIsChecked)
    }

    const handleUndo = () => {
        if(!globalContext) return
        if(pathsHistory.length >= 2){
            globalContext.setPhotoPaths(pathsHistory[pathsHistory.length - 2])
        }
    }
   



    return(
        <div className="bg-neutral-500 flex gap-3 rounded p-2 items-center">
            <Button title="Open folder" onClick={handleOpenFolder} />
            <Button title="Default" onClick={handleDefault} />
            <select defaultValue={"default"} onChange={e => setSelectedEmotion(e.target.value as Emotion)} className="bg-neutral-700 border w-1/4 border-gray-600 text-white text-sm rounded-lg block 
            p-2 focus:border-blue-500">
                <option value="default">Select emotion</option>
                <option value="happy">Happy</option>
                <option value="neutral">Neutral</option>
                <option value="sad">Sad</option>
                <option value="angry">Angry</option>
            </select>

            <div className="flex items-center">
            <input onChange={handleIndoorCheckbox} checked={indoorIsChecked} className="w-4 h-4 bg-gray-800 border-gray-600 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" type="checkbox" />
            <label className="ml-2 text-sm font-medium text-gray-200">Indoor</label>
            </div>

            <div className="flex items-center">
            <input onChange={handleOutdoorCheckbox} checked={outdoorIsChecked} className="w-4 h-4 bg-gray-800 border-gray-600 text-blue-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2" type="checkbox" />
            <label className="ml-2 text-sm font-medium text-gray-200">Outdoor</label>
            </div>
            <Button title="Undo" onClick={handleUndo} />
            <Button title="Save" onClick={handleSave} />


            <Button title="Filter" onClick={handleFilter} />
            

        </div>
    )
}