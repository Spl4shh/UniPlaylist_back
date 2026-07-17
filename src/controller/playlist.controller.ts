import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PlaylistService } from '../service/playlist.service';
import { Playlist } from '../model/playlist.model';
import { Request } from 'express';
import { User } from '../model/user.model';
import { PlaylistDto } from '../dto/playlist.dto';

interface RequestWithUser extends Request {
  user: User;
}

@Controller("/playlists")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Get()
  async getPlaylists(): Promise<Playlist[]> {
    return (await this.playlistService.getPlaylists()).map((playlist) => new PlaylistDto(playlist));
  }

  @Post()
  async createPlaylist(
    @Body() playlist: Partial<Playlist>,
    @Req() request: RequestWithUser,
  ): Promise<Playlist> {
    const playlistCreated = await this.playlistService.createPlaylist(playlist, request.user);

    return new PlaylistDto(playlistCreated);
  }
}
