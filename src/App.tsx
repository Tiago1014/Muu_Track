import { Outlet, Route, Routes } from 'react-router-dom'
import BarraInferior from './componentes/BarraInferior'
import Pantalla from './componentes/Pantalla'
import { RodeoProvider } from './store/RodeoContext'

function Marco() {
  return (
    <div className="mx-auto min-h-screen max-w-md pb-24">
      <Outlet />
      <BarraInferior />
    </div>
  )
}

export default function App() {
  return (
    <RodeoProvider>
      <Routes>
        <Route element={<Marco />}>
          <Route index element={<Pantalla titulo="Buen día, Don Carlos" />} />
          <Route path="pesar" element={<Pantalla titulo="¿Qué animal vas a pesar?" />} />
          <Route path="medir/:caravana" element={<Pantalla titulo="Medir" />} />
          <Route path="resultado/:caravana" element={<Pantalla titulo="Resultado" />} />
          <Route path="animal/:caravana" element={<Pantalla titulo="Ficha del animal" />} />
          <Route path="rodeo" element={<Pantalla titulo="Rodeo" />} />
        </Route>
      </Routes>
    </RodeoProvider>
  )
}
