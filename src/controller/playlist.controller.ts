import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlaylistService } from '../service/playlist.service';
import { Playlist } from '../model/playlist.model';

@Controller("/playlists")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  async getPlaylists(): Promise<Playlist[]> {
    return await this.playlistService.getPlaylists();
  }

  @Post()
  async createPlaylist(@Body() Playlist: Playlist): Promise<Playlist> {
    const playlistCreated = await this.playlistService.createPlaylist(Playlist);

    return playlistCreated;
  }
}
