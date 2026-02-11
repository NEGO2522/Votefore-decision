import { useState } from 'react';
import Landing from './pages/Landing';
import Sign from './components/Sign';

function App() {
  const [page, setPage] = useState('landing');

  return (
    <>
      {page === 'landing' && <Landing onSignIn={() => setPage('sign')} />}
      {page === 'sign' && <Sign onBack={() => setPage('landing')} />}
    </>
  )
}

export default App

