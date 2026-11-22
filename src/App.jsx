import { useEffect, useState } from "react";
import NoticiaCard from "./components/NoticiaCard/NoticiaCard";
import "./App.css";
import "./styles/tokens.css"

const VITE_API_URL = import.meta.env.VITE_API_URL;

function App() {

    const [noticias, setNoticias] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [termino, setTermino] = useState("");
    const [busqueda, setBusqueda] = useState("");

    function buscar(evento) {
        evento.preventDefault();
        setTermino(busqueda.trim());
    }

    function verTodas() {
        setBusqueda("");
        setTermino("");
    }

    useEffect(() => {
        const controlador = new AbortController();

        async function cargarNoticias() {
            setCargando(true);
            setError(null);
            setNoticias([]);

            const parametros = new URLSearchParams({
                limit: "12"
            });

            if (termino) {
                parametros.set("search", termino);
            }

            try {
                const respuesta = await fetch(
                    `${VITE_API_URL}/articles/?${parametros.toString()}`,
                    { signal: controlador.signal }
                );

                if (!respuesta.ok) {
                    throw new Error("Error al obtener las noticias.");
                }

                const datos = await respuesta.json();

                if (!controlador.signal.aborted) {
                    setNoticias(datos.results);
                }
            } catch (errorPeticion) {
                if (!controlador.signal.aborted) {
                    setError(errorPeticion.message)
                }
            } finally {
                if (!controlador.signal.aborted) {
                    setCargando(false)
                }
            }
        }
        cargarNoticias();
        return () => controlador.abort();

    }, [termino]);

    return (
        <>
            <header className="contenedor cabecera">
                <a className="marca" href="#inicio">Bitácora Espacial</a>
                <nav aria-label="Principal">
                    <a href="#noticias">Noticias</a>
                    <a href="#acerca">Acerca de esta demo</a>
                </nav>
            </header>

            <main className="contenedor" id="inicio">
                <h1>Explora las noticias del espacio</h1>
                <p className="introduccion">Misiones, descubrimientos y próximos destinos. Encuentra un tema y sigue explorando.</p>
                <form className="buscador" role="search" onSubmit={buscar}>
                    <label htmlFor="busqueda">Buscar por tema</label>
                    <div className="buscador__controles">
                        <input
                            type="search"
                            id="busqueda"
                            name="q"
                            placeholder="Ej.:Mars, Artemis, SpaceX"
                            value={busqueda}
                            onChange={(evento) =>
                                setBusqueda(evento.target.value)
                            } />
                        <button type="submit">Buscar</button>
                        {termino && (
                            <button type="button" onClick={verTodas}>
                                Ver todas
                            </button>
                        )}
                    </div>
                </form>

                <section aria-labelledby="titulo-noticias" id="noticicas">
                    <div className="resultador-cabecera">
                        <h2 id="titulo-noticias">Últimas noticias de la muestra</h2>
                        <p role="status"></p>
                    </div>

                    {cargando && (
                        <p role="status">
                            Cargando noticias...
                        </p>
                    )}

                    {error && (
                        <p role="alert">
                            {error}
                        </p>
                    )}

                    {!cargando &&
                        !error &&
                        noticias.length === 0 &&
                        termino && (
                            <p role="status">
                                No hay noticias para "{termino}".
                            </p>
                        )

                    }

                    <div className="grid-noticias">
                        {!cargando && !error &&
                            noticias.map((noticia) => (
                                <NoticiaCard
                                    key={noticia.id}
                                    titulo={noticia.title}
                                    resumen={noticia.summary}
                                    imagen={noticia.image_url}
                                    fuente={noticia.news_site}
                                    fecha={noticia.published_at}
                                    enlace={noticia.url}
                                />
                            ))
                        }
                    </div>
                </section>
            </main>

            <footer className="contenedor">
                <p>Datos proporcionados por Spaceflight News API</p>
            </footer>
        </>
    );
}

export default App;

