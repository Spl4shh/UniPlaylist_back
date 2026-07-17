import { Module } from '@nestjs/common';
import { PlaylistController } from './controller/playlist.controller';
import { PlaylistService } from './service/playlist.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Playlist } from './model/playlist.model';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'uniplaylist'),
        entities: [Playlist],
        synchronize: true, // Automatically syncs schema changes (Disable in production!)
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Playlist]),
  ], 
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class AppModule {}
