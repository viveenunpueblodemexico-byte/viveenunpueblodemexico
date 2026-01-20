import "./PuebloCard.css";

export default function PuebloCard({ pueblo }) {
  return (
    <article className="puebloCard">
      <header className="puebloCard__head">
        <div className="puebloCard__title">
          {pueblo.nombre}{" "}
          {pueblo.destacado ? <span className="puebloCard__star">⭐</span> : null}
        </div>
        <div className="puebloCard__state">{pueblo.estado}</div>
      </header>

      {pueblo.descripcionCorta && (
        <p className="puebloCard__desc">{pueblo.descripcionCorta}</p>
      )}

      {pueblo.tags?.length > 0 && (
        <div className="puebloCard__tags">{pueblo.tags.join(" · ")}</div>
      )}
    </article>
  );
}
