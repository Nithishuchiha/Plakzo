import { Routes, Route } from 'react-router-dom'
import ShowcaseScroll from './components/ShowcaseScroll'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ShowcaseScroll />} />
      <Route path="/showcase" element={<ShowcaseScroll />} />
    </Routes>
  )
}
