import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs';
import { getFetchedUser, getFetchedUsers, setUser, setUsers } from './user.actions';
import { TokenStorageService } from 'src/app/Auth/services/token-storage.service';
import { UserService } from 'src/app/profile/services/user.service';
@Injectable()
export class UserEffects {
  getUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getFetchedUser),
      exhaustMap(() =>
        this.tokenService.fetchUser().pipe(
          map((res) => {
            return setUser({ user: res });
          })
        )
      )
    )
  );

  getUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getFetchedUsers),
      exhaustMap(() =>
        this.userService.fetchUsers().pipe(
          map(({ users }) => {
            return setUsers({ users });
          })
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private userService:UserService,
    private tokenService: TokenStorageService
  ) {}
}
