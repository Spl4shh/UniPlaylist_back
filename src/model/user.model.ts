import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Playlist } from "./playlist.model";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  login!: string;

  @Column({ nullable: false})
  password!: string;

  @OneToMany(() => Playlist, playlist => playlist.creator,
            { cascade: true, eager: false})
  playlists?: Playlist[];
}
