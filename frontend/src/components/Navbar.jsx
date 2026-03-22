import { logoutFromSpotify } from "../api/spotify.js";
import styles from "./Navbar.module.css";

export default function Navbar({ user }) {
  return (
    <nav className={styles.nav}>
      <span className={styles.brand}>
        Spotify <em>Unwrapped</em>
      </span>

      <div className={styles.right}>
        {user && (
          <div className={styles.user}>
            {user.image && (
              <img src={user.image} alt={user.displayName} className={styles.avatar} />
            )}
            <span className={styles.username}>{user.displayName || user.id}</span>
          </div>
        )}
        <button className={styles.logout} onClick={logoutFromSpotify}>
          Log out
        </button>
      </div>
    </nav>
  );
}
