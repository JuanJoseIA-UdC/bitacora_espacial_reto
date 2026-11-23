export const filtrosIniciales = { texto: "", fuente: "", orden: "recientes" };

export function filtrarNoticias(noticias, filtros) {
  const texto = filtros.texto.trim().toLocaleLowerCase("es");
  return noticias
    .filter((noticia) => {
      const coincideTexto = `${noticia.title} ${noticia.summary}`
        .toLocaleLowerCase("es")
        .includes(texto);
      const coincideFuente = !filtros.fuente || noticia.news_site === filtros.fuente;
      return coincideTexto && coincideFuente;
    })
    .sort((a, b) => {
      if (filtros.orden === "titulo") return a.title.localeCompare(b.title, "es");
      const diferencia = new Date(b.published_at) - new Date(a.published_at);
      return filtros.orden === "antiguas" ? -diferencia : diferencia;
    });
}
