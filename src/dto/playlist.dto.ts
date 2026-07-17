import { Playlist } from "../model/playlist.model";
import { UserDto } from "./user.dto";

export class PlaylistDto {
      id?: string;
      code!: string;
      creator!: UserDto; 

      constructor(playlist: Playlist) {            
            this.id = playlist.id;
            this.code = playlist.code;
            this.creator = new UserDto(playlist.creator);
      }
}