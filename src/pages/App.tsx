import Layout from 'components/Layout'
import { CanvasProvider } from 'context/CanvasContext'
import { MaterialProvider } from 'context/MaterialContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TransitionProvider } from '../context/TransitionContext'
import All from './All'
import Home from './Home'
import SingleGlyph from './SigleGlyph'

function App() {
  return (
    <>
      <Layout />

      <MaterialProvider>
        <CanvasProvider>
          <BrowserRouter basename={process.env.PUBLIC_URL}>
            <TransitionProvider>
              <Routes>
                <Route path="/characters/:id" element={<SingleGlyph />} />
                <Route path="/characters" element={<All />}></Route>
                <Route path="*" element={<Home />} />
              </Routes>
            </TransitionProvider>
          </BrowserRouter>
        </CanvasProvider>
      </MaterialProvider>
    </>
  )
}

export default App
