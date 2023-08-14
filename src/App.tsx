import { Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Store } from './pages/Store'
import { About } from './pages/About'
import { Navbar } from './components/Navbar'
// import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <Container className='mb-4'>
        <Routes>
          <Route path='/' element={<Store />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Container>
      {/* <Footer /> */}
    </>
  )
}
