import Path from "./Path"

export default interface GlobalContextInterface{
    photoPaths: Path[]
    galleryPath: Path
    selectedPhotoPath: Path
    setPhotoPaths: (paths:Path[]) => void
    setGalleryPath: (path:Path) => void
    setSelectedPhotoPath: (path:Path) => void
}