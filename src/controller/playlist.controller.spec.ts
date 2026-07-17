import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistController } from './playlist.controller';
import { PlaylistService } from '../service/playlist.service';
import { Playlist } from '../model/playlist.model';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PlaylistController', () => {
  let playlistController: PlaylistController;

  const mockPlaylistRepository = {
    find: jest.fn().mockResolvedValue([new Playlist('PL1')]),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlaylistController],
      providers: [
        PlaylistService,
        {
          provide: getRepositoryToken(Playlist),
          useValue: mockPlaylistRepository,
        },
      ],
    }).compile();

    playlistController = app.get<PlaylistController>(PlaylistController);
  });

  describe('getPlaylists', () => {
    it('should return an array of playlists', async () => {
      const result = await playlistController.getPlaylists();
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(1);
      expect(result[0]).toEqual(new Playlist('PL1'));
    });
  });
});
