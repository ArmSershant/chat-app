import { MessageState } from './messageState';
import { UserState } from './userState';

export interface IState {
  user: UserState;
  message: MessageState;
}
