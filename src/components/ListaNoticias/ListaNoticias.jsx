import { useId, useState } from "react";
import Filtros from "../Filtros/Filtros.jsx";
import NoticiaCard from "../NoticiaCard/NoticiaCard.jsx";
import { filtrosIniciales, filtrarNoticias } from "./filtrarNoticias.js";

export default function ListaNoticias({ noticias, titulo }) {
  const [filtros, setFiltros] = useState(filtrosIniciales);
  const id = useId();
  const fuentes = [...new Set(noticias.map((noticia) => noticia.news_site))].sort();
  const visibles = filtrarNoticias(noticias, filtros);

  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{titulo}</h2>
      <Filtros
        valores={filtros}
        fuentes={fuentes}
        onCambiar={setFiltros}
        onLimpiar={() => setFiltros(filtrosIniciales)}
      />
      <p role="status">
        Mostrando {visibles.length} de {noticias.length} noticias cargadas.
      </p>
      {visibles.length === 0 && (
        <p>No hay coincidencias. Cambia el texto o la fuente, o limpia los filtros.</p>
      )}
      <div className="grid-noticias">
        {visibles.map((noticia) => (
          <NoticiaCard
            key={noticia.id}
            titulo={noticia.title}
            resumen={noticia.summary}
            imagen={noticia.image_url}
            fuente={noticia.news_site}
            fecha={noticia.published_at}
            enlace={noticia.url}
          />
        ))}
      </div>
    </section>
  );
}
