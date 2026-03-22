import { Router } from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const router = Router();

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com";
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

router.get("/login", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: [
      "user-library-read",
      "user-top-read",
    ].join(" "),
    redirect_uri: REDIRECT_URI,
  });
 
  res.redirect(`${SPOTIFY_ACCOUNTS_URL}/authorize?${params.toString()}`);
});
 
router.get("/callback", async (req, res) => {
  const { code, error } = req.query;
 
  if (error || !code) {
    console.error("Spotify auth error:", error);
    return res.redirect(`${FRONTEND_URL}/?error=access_denied`);
  }
 
  try {
    const body = new URLSearchParams({
      code,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
 
    const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
    });
 
    if (!response.ok) {
      const text = await response.text();
      console.error("Token exchange failed:", text);
      return res.redirect(`${FRONTEND_URL}/?error=token_exchange_failed`);
    }
 
    const data = await response.json();
    console.log("Token exchange response:", JSON.stringify(data, null, 2));
 
    req.session.access_token = data.access_token;
    req.session.refresh_token = data.refresh_token;
    req.session.token_expires_at = Date.now() + data.expires_in * 1000;
 
    console.log("Session before save:", req.session);
 
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.redirect(`${FRONTEND_URL}/?error=server_error`);
      }
      console.log("Session saved successfully, session ID:", req.session.id);
      res.redirect(`${FRONTEND_URL}/dashboard`);
    });
  } catch (err) {
    console.error("Callback error:", err);
    res.redirect(`${FRONTEND_URL}/?error=server_error`);
  }
});
 

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect(FRONTEND_URL);
  });
});
 
router.get("/status", (req, res) => {
  res.json({ authenticated: !!req.session?.access_token });
});
 

router.get("/refresh", async (req, res) => {
  if (!req.session?.refresh_token) {
    return res.status(401).json({ error: "No refresh token" });
  }
 
  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: req.session.refresh_token,
    });
 
    const response = await fetch(`${SPOTIFY_ACCOUNTS_URL}/api/token`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
    });
 
    if (!response.ok) {
      req.session.destroy();
      return res.status(401).json({ error: "Refresh failed, please log in again" });
    }
 
    const data = await response.json();
    req.session.access_token = data.access_token;
    req.session.token_expires_at = Date.now() + data.expires_in * 1000;
 
    res.json({ success: true });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});
 
export default router;