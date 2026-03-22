import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { loginWithSpotify } from "../api/spotify.js";
import styles from "./Home.module.css";

export default function Home() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const [hovered, setHovered] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid} aria-hidden="true" />

      <main className={`${styles.content} fade-up`}>
        <div className={styles.eyebrow}>YOUR YEAR IN SOUND</div>

        <h1 className={styles.title}>
          Spotify<br />
          <em>Unwrapped</em>
        </h1>

        <p className={styles.subtitle}>
          Top artists. Top tracks. Genre seeds.<br />
          All yours — beautifully laid out.
        </p>

        {error && (
          <p className={styles.error}>
            {error === "access_denied"
              ? "Access was denied. Please try again."
              : "Something went wrong. Please try again."}
          </p>
        )}

        <button
          className={styles.loginBtn}
          onClick={loginWithSpotify}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className={styles.btnText}>Connect with Spotify</span>
          <span className={styles.btnArrow}>{hovered ? "→" : "↗"}</span>
        </button>

        <p className={styles.note}>
          Reads your listening history. Never stores your data.
        </p>
      </main>

      <footer className={styles.footer}>
        <span>Built with Spotify Web API</span>
        <span>·</span>
        <span>Not affiliated with Spotify AB</span>
      </footer>
    </div>
  );
}
