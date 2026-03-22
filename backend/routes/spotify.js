import { Router } from "express";
import fetch from "node-fetch";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const SPOTIFY_API = "https://api.spotify.com/v1";

async function getData(endpoint, accessToken) {
  const response = await fetch(`${SPOTIFY_API}${endpoint}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw Object.assign(new Error(err?.error?.message || "Spotify API error"), {
      status: response.status,
    });
  }

  return response.json();
}

// NOTE: /recommendations/available-genre-seeds was deprecated by Spotify in 2024
// and returns an empty body. Genres are now derived from the user's top artists.

router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const token = req.session.access_token;

    const [
      userInfo,
      likedTracks,
      topArtistsLong,
      topArtistsMedium,
      topArtistsShort,
      topTracksLong,
      topTracksMedium,
      topTracksShort,
    ] = await Promise.all([
      getData("/me", token),
      getData("/me/tracks?limit=10", token),
      getData("/me/top/artists?limit=10&time_range=long_term", token),
      getData("/me/top/artists?limit=5&time_range=medium_term", token),
      getData("/me/top/artists?limit=5&time_range=short_term", token),
      getData("/me/top/tracks?limit=5&time_range=long_term", token),
      getData("/me/top/tracks?limit=5&time_range=medium_term", token),
      getData("/me/top/tracks?limit=5&time_range=short_term", token),
    ]);

    const topGenres = [
      ...new Set(topArtistsLong.items.flatMap((a) => a.genres)),
    ].slice(0, 5);

    res.json({
      user: {
        id: userInfo.id,
        displayName: userInfo.display_name,
        image: userInfo.images?.[0]?.url ?? null,
      },
      likedTracks: likedTracks.items.map((item) => ({
        id: item.track.id,
        name: item.track.name,
        previewUrl: item.track.preview_url,
        artistId: item.track.artists[0].id,
        artistName: item.track.artists[0].name,
        albumImage: item.track.album.images[0]?.url ?? null,
      })),
      topGenres,
      topArtists: {
        long: topArtistsLong.items.slice(0, 5).map(formatArtist),
        medium: topArtistsMedium.items.map(formatArtist),
        short: topArtistsShort.items.map(formatArtist),
      },
      topTracks: {
        long: topTracksLong.items.map(formatTrack),
        medium: topTracksMedium.items.map(formatTrack),
        short: topTracksShort.items.map(formatTrack),
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    const status = err.status === 401 ? 401 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.get("/recommendations", requireAuth, async (req, res) => {
  const { artist, track } = req.query;

  if (!artist || !track) {
    return res.status(400).json({ error: "artist and track query params are required" });
  }

  try {
    const params = new URLSearchParams({
      seed_artists: artist,
      seed_tracks: track,
      seed_genres: "rock",
      limit: 10,
    });

    const data = await getData(`/recommendations?${params}`, req.session.access_token);

    res.json({
      tracks: data.tracks.map(formatTrack),
    });
  } catch (err) {
    console.error("Recommendations error:", err);
    const status = err.status === 401 ? 401 : 500;
    res.status(status).json({ error: err.message });
  }
});

function formatArtist(artist) {
  return {
    id: artist.id,
    name: artist.name,
    url: `https://open.spotify.com/artist/${artist.id}`,
    image: artist.images?.[0]?.url ?? null,
  };
}

function formatTrack(track) {
  return {
    id: track.id,
    name: track.name,
    previewUrl: track.preview_url,
    artistId: track.artists[0].id,
    artistName: track.artists[0].name,
    albumImage: track.album?.images?.[0]?.url ?? null,
  };
}

export default router;