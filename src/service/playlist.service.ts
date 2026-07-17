import { ConflictException, Injectable } from '@nestjs/common';
import { Playlist } from '../model/playlist.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) { }

  async getPlaylists(): Promise<Playlist[]> {
    return await this.playlistRepository.find();
  }

  async createPlaylist(playlist: Playlist): Promise<Playlist> {
    if (await this.playlistRepository.findOne({ where: { code: playlist.code } })) {
      throw new ConflictException(`Playlist with code ${playlist.code} already exists.`);
    } else {
      const playlistSaved = await this.playlistRepository.save(playlist);

      return playlistSaved;
    }
  }
}
