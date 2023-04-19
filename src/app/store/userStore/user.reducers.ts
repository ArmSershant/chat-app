import { createReducer, on } from '@ngrx/store';
import { setUser, setUsers } from './user.actions';
import { UserState } from '../state/userState';
import { User } from 'src/app/Auth/models/user.model';
export const initialState: UserState = {
  user: {} as User,
  users: [],
};

export const UserReducer = createReducer(
  initialState,
  on(setUser, (state, { user }) => {return { ...state, user: user }}),
  on(setUsers, (state, { users }) => ({ ...state, users: users }))
);
