import { Module } from '@nestjs/common';
import { PlaylistController } from './controller/playlist.controller';
import { PlaylistService } from './service/playlist.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './model/playlist.model';
import { User } from './model/user.model';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          type: 'mysql',
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          username: configService.getOrThrow<string>('DB_USERNAME'),
          password: configService.getOrThrow<string>('DB_PASSWORD'),
          database: configService.getOrThrow<string>('DB_NAME'),
          entities: [
            Playlist,
            User
          ],
          synchronize: true, // Automatically syncs schema changes (Disable in production!)
        }),
        inject: [ConfigService],
      }),
      TypeOrmModule.forFeature([
        Playlist,
        User
      ]),
    ], 
  controllers: [
    AuthController,
    PlaylistController, 
    UserController
  ],
  providers: [
    AuthService,
    ConfigService,
    PlaylistService,
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
