import express from "express"; //framework for createing web-server applications
import fetch from "node-fetch";

const app = express();

//SET tells explains to express that we're using "views"
app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public")); //tell express that we're using eplates for using pug, but we have static files in the folder

const redirect_uri = "http://localhost:3000/callback";
const client_id = "9da41224353040958358ffa03684a15d";
const client_secret = "41c612cad6764314b516413d9606e99d";

global.access_token;

// "res"= response. 
app.get("/", function (req, res) {
  res.render("index");
});

//GET request to AUTHORIZE endpoint
app.get("/authorize", (req, res) => {
  
  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: "user-library-read user-top-read", //way of authorizing app for only one specific access feature
    redirect_uri: redirect_uri, //once we grant permission to spotify, 
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_parameters.toString()
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  var body = new URLSearchParams({
    code: code,
    redirect_uri: redirect_uri,
    grant_type: 'authorization_code',
  });

  //post request
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    body: body,
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
  });

  const data = await response.json();
  global.access_token = data.access_token;
  res.redirect("/dashboard");
});


app.get("/dashboard", async (req, res) => {
  const userInfo = await getData("/me");
  const tracks = await getData("/me/tracks?limit=10");

  // Fetch top genres for different time ranges
  const topGenres = await getData("/recommendations/available-genre-seeds");

  // Fetch top artists for different time ranges
  const topArtistsLongTerm = await getData("/me/top/artists?limit=5&time_range=long_term");
  const topArtistsMediumTerm = await getData("/me/top/artists?limit=5&time_range=medium_term");
  const topArtistsShortTerm = await getData("/me/top/artists?limit=5&time_range=short_term");

  // Fetch top tracks for different time ranges
  const topTracksLongTerm = await getData("/me/top/tracks?limit=5&time_range=long_term");
  const topTracksMediumTerm = await getData("/me/top/tracks?limit=5&time_range=medium_term");
  const topTracksShortTerm = await getData("/me/top/tracks?limit=5&time_range=short_term");

  res.render("dashboard", {
    user: userInfo,
    tracks: tracks.items,
    topGenres: topGenres.genres.slice(0, 5), // Display the top 5 genres
    topArtistsLongTerm: topArtistsLongTerm.items,
    topArtistsMediumTerm: topArtistsMediumTerm.items,
    topArtistsShortTerm: topArtistsShortTerm.items,
    topTracksLongTerm: topTracksLongTerm.items,
    topTracksMediumTerm: topTracksMediumTerm.items,
    topTracksShortTerm: topTracksShortTerm.items,
  });

});

//recieve the endpoint for multiple APIs
async function getData(endpoint) {
  const response = await fetch("https://api.spotify.com/v1" + endpoint, {
    method: "get",
    headers: {
      Authorization: "Bearer " + global.access_token,
    },
  });

  const data = await response.json();
  return data;
}

app.get("/recommendations", async (req, res) => {
  const artist_id = req.query.artist;
  const track_id = req.query.track;

  const params = new URLSearchParams({
    seed_artist: artist_id,
    seed_genres: "rock",
    seed_tracks: track_id,
  });

  const data = await getData("/recommendations?" + params);
  res.render("recommendation", { tracks: data.tracks });
});

// Add this route
app.get("/logout", (req, res) => {
  global.access_token = null; // Clear the access token
  res.redirect("/");
});

let listener = app.listen(3000, function () {
  console.log(
    "Your app is listening on http://localhost:" + listener.address().port
  );
});
