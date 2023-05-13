const { Pool } = require('pg');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    let query;
    let result;

    query = {
      text: 'SELECT id, name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    result = await this._pool.query(query);
    const playlist = result.rows[0];

    query = {
      text: 'SELECT * FROM songs WHERE id IN (SELECT song_id FROM playlist_songs WHERE playlist_id = $1)',
      values: [playlistId],
    };

    result = await this._pool.query(query);
    const songs = result.rows;

    const mappedSongs = songs.map(({ id, title, performer }) => ({
      id,
      title,
      performer,
    }));

    const playlistSongs = {
      playlist: {
        ...playlist,
        songs: mappedSongs,
      },
    };

    console.log(playlistSongs);

    return playlistSongs;
  }
}

module.exports = PlaylistSongsService;
