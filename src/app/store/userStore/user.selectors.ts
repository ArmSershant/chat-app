import { createSelector } from '@ngrx/store';
import { IState } from '../state/state';
import { UserState } from '../state/userState';

export const selectFeature = (state: IState) => state.user;
export const selectUser = createSelector(selectFeature, (state: UserState) => {
  return state.user;
});
export const selectUsers = createSelector(selectFeature, (state: UserState) => {
  return state.users
})
