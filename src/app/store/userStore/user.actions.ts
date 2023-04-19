import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/Auth/models/user.model';

const SET_LOGGED_USER = '[Profile Component] set user';
export const setUser = createAction(SET_LOGGED_USER, props<{ user: User }>());

const SET_USERS = '[Profile Component] set users';
export const setUsers = createAction(SET_USERS, props<{ users: User[] }>());
// ******async****** //

const GET_ASYNC_LOGGED_USER = '[Profile Component] get fetched async user';
export const getFetchedUser = createAction(GET_ASYNC_LOGGED_USER);

const GET_ASYNC_FETCHED_USERS = '[Profile Component] get fetched async users';
export const getFetchedUsers = createAction(GET_ASYNC_FETCHED_USERS);
