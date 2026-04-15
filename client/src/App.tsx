import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import CrisisFooter from './components/layout/CrisisFooter'
import BannerGate from './components/layout/BannerGate'
import { appRoutes } from './navigation'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-cream">
        <BannerGate />
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {appRoutes.map(({ path, component: Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Routes>
        </main>
        <CrisisFooter />
        <Footer />
      </div>
    </Router>
  )
}

export default App
