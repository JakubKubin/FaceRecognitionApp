import Gallery from "./components/Gallery"
import Modal from "./components/Modal"
import Panel from "./components/Panel"
import GlobalContextProvider from "./contexts/GlobalContextProvider"



function App(): JSX.Element {
  return (
    <div className="h-screen w-screen p-8 flex flex-col gap-5 bg-neutral-700">
      <GlobalContextProvider>
        <Panel />
        <Gallery />
         <Modal />
      </GlobalContextProvider>
    </div>
  )
}

export default App
