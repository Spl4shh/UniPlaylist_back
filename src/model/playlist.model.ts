import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity('playlist')
export class Playlist {

      @PrimaryColumn()
      code!: string;

      constructor(code: string) {
            this.code = code;
      }
}     