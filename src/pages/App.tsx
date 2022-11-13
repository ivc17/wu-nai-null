import Layout from 'components/Layout'
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
        <BrowserRouter>
          <TransitionProvider>
            <Routes>
              <Route path="/characters/:id" element={<SingleGlyph />} />
              <Route path="/characters" element={<All />}></Route>
              <Route path="*" element={<Home />} />
            </Routes>
          </TransitionProvider>
        </BrowserRouter>
      </MaterialProvider>
    </>
  )
}

export default App
