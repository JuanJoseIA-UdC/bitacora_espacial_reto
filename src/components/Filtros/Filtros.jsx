import { useId } from "react";
import "./Filtros.css";

export default function Filtros({ valores, fuentes, onCambiar, onLimpiar }) {
  const id = useId();
  return (
    <fieldset className="filtros-noticias">
      <legend>Filtrar las noticias cargadas</legend>
      <label htmlFor={`${id}-texto`}>
        Título o resumen
        <input
          id={`${id}-texto`}
          type="search"
          value={valores.texto}
          onChange={(evento) => onCambiar({ ...valores, texto: evento.target.value })}
        />
      </label>
      <label htmlFor={`${id}-fuente`}>
        Fuente
        <select
          id={`${id}-fuente`}
          value={valores.fuente}
          onChange={(evento) => onCambiar({ ...valores, fuente: evento.target.value })}
        >
          <option value="">Todas las fuentes</option>
          {fuentes.map((fuente) => (
            <option key={fuente} value={fuente}>
              {fuente}
            </option>
          ))}
        </select>
      </label>
      <label htmlFor={`${id}-orden`}>
        Orden
        <select
          id={`${id}-orden`}
          value={valores.orden}
          onChange={(evento) => onCambiar({ ...valores, orden: evento.target.value })}
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguas">Más antiguas</option>
          <option value="titulo">Título A–Z</option>
        </select>
      </label>
      <button type="button" onClick={onLimpiar}>
        Limpiar filtros
      </button>
    </fieldset>
  );
}
