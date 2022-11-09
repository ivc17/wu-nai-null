import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { TransitionProvider } from '../context/TransitionContext'
import All from './All'
import Home from './Home'
import SingleGlyph from './SigleGlyph'

function App() {
  return (
    <div style={{ minWidth: 300, background: '#fcfcfc' }}>
      <BrowserRouter>
        <TransitionProvider>
          <Routes>
            <Route path="/all" element={<All />} />
            <Route path="/test" element={<SingleGlyph />} />
            <Route path="*" element={<Home />} />
          </Routes>{' '}
        </TransitionProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
