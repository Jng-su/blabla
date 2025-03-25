import { Socket } from 'socket.io';

export interface AuthSocket extends Socket {
  user?: { id: string; email: string; name: string; role: string };
}
