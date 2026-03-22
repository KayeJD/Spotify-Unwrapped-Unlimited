import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getRecommendations } from "../api/spotify.js";
import Navbar from "../components/Navbar.jsx";
import TrackTable from "../components/TrackTable.jsx";
import styles from "./Recommendations.module.css";

export default function Recommendations() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const artistId = searchParams.get("artist");
  const trackId = searchParams.get("track");

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!artistId || !trackId) {
      navigate("/dashboard", { replace: true });
      return;
    }

    getRecommendations(artistId, trackId)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [artistId, trackId]);

  return (
    <div className="page">
      <Navbar />

      <header className={`${styles.hero} fade-up`}>
        <button className={styles.back} onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <div>
          <p className={styles.eyebrow}>Discovered for you</p>
          <h1 className={styles.title}>Recommendations</h1>
        </div>
      </header>

      {error && (
        <p className={styles.error}>Failed to load recommendations: {error}</p>
      )}

      {!data && !error && (
        <div className={styles.loading}>
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
        </div>
      )}

      {data && (
        <section className={`${styles.section} fade-up`} style={{ animationDelay: "0.15s" }}>
          <div className={styles.card}>
            <p className={styles.cardHint}>
              Based on your selected artist &amp; track seed.
            </p>
            <TrackTable tracks={data.tracks} />
          </div>
        </section>
      )}
    </div>
  );
}
