import { useEffect, useState } from "react";
import { getDashboard } from "../api/spotify.js";
import Navbar from "../components/Navbar.jsx";
import TimeRangeTabs from "../components/TimeRangeTabs.jsx";
import ArtistList from "../components/ArtistList.jsx";
import TrackTable from "../components/TrackTable.jsx";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("short");

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="page">
        <Navbar />
        <p className={styles.error}>Failed to load: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page">
        <Navbar />
        <div className={styles.loading}>
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
          <span className={styles.loadingDot} />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Navbar user={data.user} />

      <header className={`${styles.hero} fade-up`}>
        {data.user.image && (
          <img src={data.user.image} alt={data.user.displayName} className={styles.heroAvatar} />
        )}
        <div>
          <p className={styles.heroEyebrow}>Welcome back</p>
          <h1 className={styles.heroName}>{data.user.displayName || data.user.id}</h1>
        </div>
      </header>

      <section className={`${styles.section} fade-up`} style={{ animationDelay: "0.1s" }}>
        <h2 className={styles.sectionTitle}>Top Genres</h2>
        <div className={styles.pills}>
          {data.topGenres.map((genre) => (
            <span key={genre} className={styles.pill}>{genre}</span>
          ))}
        </div>
      </section>

      <section className={`${styles.section} fade-up`} style={{ animationDelay: "0.2s" }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Your Top Listening</h2>
          <TimeRangeTabs active={timeRange} onChange={setTimeRange} />
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Artists</h3>
            <ArtistList artists={data.topArtists[timeRange]} />
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Tracks</h3>
            <TrackTable tracks={data.topTracks[timeRange]} />
          </div>
        </div>
      </section>

      <section className={`${styles.section} fade-up`} style={{ animationDelay: "0.3s" }}>
        <h2 className={styles.sectionTitle}>Recently Liked</h2>
        <p className={styles.sectionHint}>
          Click <strong>Recommend</strong> on any track to discover similar music.
        </p>
        <div className={styles.card}>
          <TrackTable tracks={data.likedTracks} showRecommendations />
        </div>
      </section>
    </div>
  );
}
