import { ConflictException, Injectable } from '@nestjs/common';
import { Playlist } from '../model/playlist.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../model/user.model';

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(Playlist)
    private readonly playlistRepository: Repository<Playlist>,
  ) { }

  async getPlaylists(): Promise<Playlist[]> {
    return await this.playlistRepository.find();
  }

  async createPlaylist(playlist: Partial<Playlist>, userCreator: User): Promise<Playlist> {
    if (await this.playlistRepository.findOne({ where: { code: playlist.code } })) {
      throw new ConflictException(`Playlist with code ${playlist.code} already exists.`);
    } else {
      playlist.creator = userCreator;

      const playlistSaved = await this.playlistRepository.save(playlist);

      return playlistSaved;
    }
  }
}
