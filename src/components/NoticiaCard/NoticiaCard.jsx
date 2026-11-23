import "./NoticiaCard.css";

export default function NoticiaCard({
  titulo,
  resumen,
  imagen,
  fuente,
  fecha,
  enlace,
  textoAccion,
  onAccion,
  deshabilitada = false,
}) {
  const fechaFormateada = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
  }).format(new Date(fecha));

  return (
    <article className="noticia-card">
      <img
        className="noticia-card__imagen"
        src={imagen}
        alt=""
        loading="lazy"
      />
      <h3 className="noticia-card__titulo">{titulo}</h3>
      <p className="noticia-card__resumen">{resumen}</p>
      <p className="noticia-card__meta">
        {fuente} · <time dateTime={fecha}>{fechaFormateada}</time>
      </p>
      <a
        className="noticia-card__enlace"
        href={enlace}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Leer noticia: ${titulo} (abre otra pestaña)`}
      >
        Leer noticia
      </a>
      {onAccion && (
        <button
          type="button"
          disabled={deshabilitada}
          onClick={onAccion}
          aria-label={`${textoAccion}: ${titulo}`}
        >
          {textoAccion}
        </button>
      )}
    </article>
  );
}
