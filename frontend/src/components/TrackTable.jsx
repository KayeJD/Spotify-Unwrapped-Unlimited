import { useNavigate } from "react-router-dom";
import styles from "./TrackTable.module.css";

export default function TrackTable({ tracks, showRecommendations = false }) {
  const navigate = useNavigate();

  if (!tracks?.length) return <p className={styles.empty}>No data yet.</p>;

  return (
    <div className={`${styles.table} fade-up-children`}>
      {tracks.map((track, i) => (
        <div key={track.id ?? i} className={styles.row}>
          <span className={styles.rank}>{String(i + 1).padStart(2, "0")}</span>

          {track.albumImage && (
            <img
              src={track.albumImage}
              alt={`${track.name} album art`}
              className={styles.art}
            />
          )}

          <div className={styles.info}>
            <span className={styles.trackName}>{track.name}</span>
            <span className={styles.artistName}>{track.artistName}</span>
          </div>

          <div className={styles.actions}>
            {track.previewUrl && (
              <a
                href={track.previewUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.actionBtn}
              >
                Preview
              </a>
            )}
            {showRecommendations && (
              <button
                className={`${styles.actionBtn} ${styles.recBtn}`}
                onClick={() =>
                  navigate(
                    `/recommendations?artist=${track.artistId}&track=${track.id}`
                  )
                }
              >
                Recommend
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
