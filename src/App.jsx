import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Sign from './components/Sign';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/sign-in" element={<Sign />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

