/* eslint-disable no-console */
import type { NextApiResponse, NextApiRequest } from 'next';
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  // clientId: process.env.SPOTIFY_CLIENT_ID,
  // clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  clientId: '858afce37e5a4ae8a213fb4a6c3a8931',
  clientSecret: '5e95a8048fff497b91ea0d3657fab0c2',
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { artist, popularity, playlistName } = req.body;

  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);

    const searchResults = await spotifyApi.searchArtists(artist, { limit: 1 });

    if (
      !searchResults.body.artists?.items ||
      searchResults.body.artists.items.length === 0
    ) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const artistId = searchResults.body.artists.items[0].id;
    const tracks = await spotifyApi.getArtistTopTracks(artistId, 'US');

    if (!tracks.body.tracks) {
      return res.status(404).json({ error: 'Tracks not found' });
    }

    const filteredTracks = tracks.body.tracks.filter(
      (track) =>
        track.popularity >= popularity.min && track.popularity <= popularity.max
    );

    // For creating a playlist
    const userId = 'YOUR_SPOTIFY_USER_ID'; // Fetch dynamically or hardcode if it's always the same
    const playlistData = await spotifyApi.createPlaylist(userId, playlistName);

    if (!playlistData || !playlistData.body || !playlistData.body.id) {
      return res.status(500).json({ error: 'Failed to create playlist' });
    }

    const trackIds = filteredTracks.map((track) => track.id);
    await spotifyApi.addTracksToPlaylist(
      playlistData.body.id,
      trackIds.map((id) => `spotify:track:${id}`)
    );

    if (!playlistData.body.external_urls?.spotify) {
      return res.status(500).json({ error: 'Failed to get playlist link' });
    }

    return res
      .status(200)
      .json({ playlistLink: playlistData.body.external_urls.spotify });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create playlist' });
  }
};
