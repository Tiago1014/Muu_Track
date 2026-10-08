import { Outlet, Route, Routes } from 'react-router-dom'
import BarraInferior from './componentes/BarraInferior'
import Logo from './componentes/Logo'
import Buscar from './pantallas/Buscar'
import Ficha from './pantallas/Ficha'
import Inicio from './pantallas/Inicio'
import Medir from './pantallas/Medir'
import Resultado from './pantallas/Resultado'
import Rodeo from './pantallas/Rodeo'
import { RodeoProvider } from './store/RodeoContext'

function Marco() {
  return (
    <div className="mx-auto min-h-screen max-w-md pb-24">
      <header className="p-5">
        <Logo />
      </header>
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
          <Route index element={<Inicio />} />
          <Route path="pesar" element={<Buscar />} />
          <Route path="resultado/:caravana" element={<Resultado />} />
          <Route path="animal/:caravana" element={<Ficha />} />
          <Route path="rodeo" element={<Rodeo />} />
        </Route>
        {/* La cámara ocupa toda la pantalla, sin barra ni encabezado */}
        <Route path="medir/:caravana" element={<Medir />} />
      </Routes>
    </RodeoProvider>
  )
}
