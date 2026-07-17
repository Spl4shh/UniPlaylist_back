import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from '../service/playlist.service';
import { Playlist } from '../model/playlist.model';

describe('PlaylistController', () => {
  let playlistController: PlaylistController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [PlaylistService],
    }).compile();

    playlistController = app.get<PlaylistController>(PlaylistController);
  });

  describe('getPlaylists', () => {
    it('should return an array of playlists', () => {
      const result = playlistController.getPlaylists();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(3);
      expect(result[0]).toEqual(new Playlist(1, 'PL1'));
    });
  });
});
