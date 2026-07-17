import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/playlists (GET)', () => {
    return request(app.getHttpServer())
      .get('/playlists')
      .expect(200)
      .expect([
        { id: 1, code: 'PL1' },
        { id: 2, code: 'PL2' },
        { id: 3, code: 'PL3' },
      ]);
  });

  afterEach(async () => {
    await app.close();
  });
});
