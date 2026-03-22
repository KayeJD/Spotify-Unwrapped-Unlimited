import express from "express";
import fetch from "node-fetch";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();



async function spotifyGet(endpoint, accessToken) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });

  if (!response.ok) {
    const err = await response.json();
    console.error(`Spotify API error on ${endpoint}:`, err);
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}


router.get("/dashboard", requireAuth, async (req, res) => {
  const token = req.session.access_token;

  try {
    const [
      userInfo,
      likedTracks,
      genreSeeds,
      topArtistsLongTerm,
      topArtistsMediumTerm,
      topArtistsShortTerm,
      topTracksLongTerm,
      topTracksMediumTerm,
      topTracksShortTerm,
    ] = await Promise.all([
      spotifyGet("/me", token),
      spotifyGet("/me/tracks?limit=10", token),
      spotifyGet("/recommendations/available-genre-seeds", token),
      spotifyGet("/me/top/artists?limit=5&time_range=long_term", token),
      spotifyGet("/me/top/artists?limit=5&time_range=medium_term", token),
      spotifyGet("/me/top/artists?limit=5&time_range=short_term", token),
      spotifyGet("/me/top/tracks?limit=5&time_range=long_term", token),
      spotifyGet("/me/top/tracks?limit=5&time_range=medium_term", token),
      spotifyGet("/me/top/tracks?limit=5&time_range=short_term", token),
    ]);

    res.json({
      user: userInfo,
      likedTracks: likedTracks.items,
      topGenres: genreSeeds.genres.slice(0, 5),
      topArtists: {
        longTerm: topArtistsLongTerm.items,
        mediumTerm: topArtistsMediumTerm.items,
        shortTerm: topArtistsShortTerm.items,
      },
      topTracks: {
        longTerm: topTracksLongTerm.items,
        mediumTerm: topTracksMediumTerm.items,
        shortTerm: topTracksShortTerm.items,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data." });
  }
});



router.get("/recommendations", requireAuth, async (req, res) => {
  const { artist, track } = req.query;

  if (!artist || !track) {
    return res.status(400).json({ error: "artist and track query params are required." });
  }

  try {
    const params = new URLSearchParams({
      seed_artists: artist,
      seed_genres: "rock",
      seed_tracks: track,
    });

    const data = await spotifyGet("/recommendations?" + params, req.session.access_token);
    res.json({ tracks: data.tracks });
  } catch (err) {
    console.error("Recommendations error:", err);
    res.status(500).json({ error: "Failed to load recommendations." });
  }
});

export default router;
