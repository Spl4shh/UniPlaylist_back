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

  it('/playlists (GET) - unauthorized', () => {
    return request(app.getHttpServer())
      .get('/playlists')
      .expect(401);
  });

  it('/playlists (GET) - authorized after user registration', async () => {
    const login = 'testuser_' + Date.now();
    const password = 'testpassword';

    // 1. Register a test user
    await request(app.getHttpServer())
      .post('/users')
      .send({ login, password })
      .expect(201);

    // 2. Fetch playlists using Basic auth credentials
    const credentials = Buffer.from(`${login}:${password}`).toString('base64');
    const response = await request(app.getHttpServer())
      .get('/playlists')
      .set('Authorization', `Basic ${credentials}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  afterEach(async () => {
    await app.close();
  });
});
