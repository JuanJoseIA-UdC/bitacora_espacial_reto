import { useState } from "react";

export default function LecturasEspaciales({ noticias }) {
  const [guardadas, setGuardadas] = useState([]);

  function guardarNoticia(noticia) {
    setGuardadas((actuales) =>
      actuales.some((item) => item.id === noticia.id)
        ? actuales
        : [...actuales, noticia],
    );
  }

  return (
    <section>
      <h2>Mi próxima lectura ({guardadas.length})</h2>
      <p>Noticias disponibles: {noticias.length}</p>
    </section>
  );
}
