import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.model";

@Entity('playlist')
export class Playlist {

      @PrimaryGeneratedColumn()
      id?: string;

      @Column({ unique: true })
      code!: string;

      @ManyToOne(() => User, { nullable: false, eager: true })
      creator!: User;
}     