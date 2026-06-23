import { Routes, Route } from 'react-router-dom'
import ShowcaseScroll from './components/ShowcaseScroll'
import GalleryPage from './pages/GalleryPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShowcaseScroll />} />
      <Route path="/showcase" element={<ShowcaseScroll />} />
      <Route path="/gallery/:slug" element={<GalleryPage />} />
    </Routes>
  )
}
