interface ButtonInterface{
    title: string
    onClick: any
}

export default function Button({title, onClick}:ButtonInterface){

    return(
        <div className="bg-fuchsia-800 p-1.5 text-gray-50 rounded-lg hover:bg-fuchsia-950 cursor-pointer" onClick={() => {onClick()}}>
            {title}
        </div>
    )
}