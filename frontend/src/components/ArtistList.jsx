import styles from "./ArtistList.module.css";

export default function ArtistList({ artists }) {
  if (!artists?.length) return <p className={styles.empty}>No data yet.</p>;

  return (
    <ol className={`${styles.list} fade-up-children`}>
      {artists.map((artist, i) => (
        <li key={artist.id} className={styles.item}>
          <span className={styles.rank}>{String(i + 1).padStart(2, "0")}</span>

          {artist.image && (
            <img src={artist.image} alt={artist.name} className={styles.image} />
          )}

          <a
            href={artist.url}
            target="_blank"
            rel="noreferrer"
            className={styles.name}
          >
            {artist.name}
          </a>

          <span className={styles.arrow}>↗</span>
        </li>
      ))}
    </ol>
  );
}
