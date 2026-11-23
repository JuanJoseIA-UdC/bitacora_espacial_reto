import { useEffect, useState } from "react";
import ListaNoticias from "./components/ListaNoticias/ListaNoticias.jsx";

export default function App() {
  const [termino, setTermino] = useState("");
  const [noticias, setNoticias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controlador = new AbortController();
    const api = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");
    setCargando(true);
    setError("");
    setNoticias([]);

    const tiempoLimite = setTimeout(() => {
      setError(
        "La API tardó demasiado en responder. Comprueba tu conexión y vuelve a intentarlo.",
      );
      setCargando(false);
      controlador.abort();
    }, 15000);

    async function cargarNoticias() {
      try {
        if (!api)
          throw new Error(
            "Falta VITE_API_URL. Configura el archivo .env y reinicia Vite.",
          );
        const parametros = new URLSearchParams({
          limit: "12",
          search: termino,
        });
        const respuesta = await fetch(`${api}/articles/?${parametros}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok)
          throw new Error(
            `No se pudieron cargar las noticias (HTTP ${respuesta.status}).`,
          );
        const datos = await respuesta.json();
        if (!Array.isArray(datos.results))
          throw new Error("La API devolvió un formato de noticias inesperado.");
        if (!controlador.signal.aborted) setNoticias(datos.results);
      } catch (causa) {
        if (!controlador.signal.aborted) {
          setError(
            causa instanceof Error
              ? causa.message
              : "No se pudo conectar con la API.",
          );
        }
      } finally {
        clearTimeout(tiempoLimite);
        if (!controlador.signal.aborted) setCargando(false);
      }
    }

    cargarNoticias();
    return () => {
      controlador.abort();
      clearTimeout(tiempoLimite);
    };
  }, [termino]);

  function buscar(evento) {
    evento.preventDefault();
    const formulario = new FormData(evento.currentTarget);
    setTermino(String(formulario.get("q") ?? "").trim());
  }

  return (
    <>
      <a className="saltar-contenido" href="#contenido">
        Saltar al contenido
      </a>
      <header className="contenedor cabecera">
        <a className="marca" href="#contenido">
          Bitácora Espacial
        </a>
        <nav aria-label="Principal">
          <a href="#noticias">Noticias</a>
          <a
            href="https://www.nasa.gov/blogs/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blogs de NASA
          </a>
          <a href="#acerca">Acerca</a>
        </nav>
      </header>
      <main className="contenedor" id="contenido">
        <h1>Explora las noticias del espacio</h1>
        <p className="introduccion">
          Misiones, descubrimientos y próximos destinos. Busca un tema y abre la
          noticia original para conocer más.
        </p>
        <form className="buscador" role="search" onSubmit={buscar}>
          <label htmlFor="busqueda">Buscar por tema</label>
          <div className="buscador__campos">
            <input
              id="busqueda"
              name="q"
              type="search"
              placeholder="Ej.: Mars, Artemis, SpaceX"
              aria-describedby="ayuda-busqueda"
            />
            <button type="submit">Buscar</button>
          </div>
          <p id="ayuda-busqueda">
            Deja el campo vacío y pulsa Buscar para volver a las últimas
            noticias.
          </p>
        </form>
        <section
          id="noticias"
          aria-labelledby="titulo-noticias"
          aria-busy={cargando}
        >
          <h2 id="titulo-noticias">
            {termino ? `Resultados para “${termino}”` : "Últimas noticias"}
          </h2>
          {cargando && (
            <p className="estado" role="status">
              Cargando noticias…
            </p>
          )}
          {error && (
            <div className="estado estado--error">
              <p role="alert">{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Volver a cargar
              </button>
            </div>
          )}
          {!cargando && !error && noticias.length === 0 && (
            <p className="estado" role="status">
              No hay noticias para "{termino}".
            </p>
          )}
          {!cargando && !error && noticias.length > 0 && (
            <p className="recuento" role="status">
              Mostrando {noticias.length} noticias, hasta 12 por búsqueda.
            </p>
          )}
          {!cargando && !error && noticias.length > 0 && (
            <>
              <ListaNoticias
                key={`todas-${termino}`}
                noticias={noticias}
                titulo="Todas las noticias cargadas"
              />
              <ListaNoticias
                key={`seleccion-${termino}`}
                noticias={noticias.slice(0, 3)}
                titulo="Selección de tres noticias"
              />
            </>
          )}
        </section>
      </main>
      <footer className="contenedor" id="acerca">
        <strong>Acerca de Bitácora Espacial</strong>
        <p>
          Portal académico del reto 3. Datos de{" "}
          <a
            href="https://spaceflightnewsapi.net/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Spaceflight News API
          </a>
          . Los textos conservan el idioma de su fuente y las noticias cambian
          con el tiempo.
        </p>
      </footer>
    </>
  );
}
