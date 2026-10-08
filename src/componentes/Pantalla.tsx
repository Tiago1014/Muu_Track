export default function Pantalla({ titulo }: { titulo: string }) {
  return (
    <section className="p-5">
      <h1 className="text-3xl font-bold text-campo-oscuro">{titulo}</h1>
    </section>
  )
}
