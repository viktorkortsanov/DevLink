import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { AdminService } from '../../admin.service';
import * as ChatActions from './chat.actions';

@Injectable()
export class ChatEffects {

  loadChatHistory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ChatActions.loadChatHistory),
      mergeMap(() =>
        this.adminService.getAdminChatHistory().pipe(
          map(messages => ChatActions.loadChatHistorySuccess({ messages })),
          catchError(error => of(ChatActions.loadChatHistoryFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private adminService: AdminService
  ) {}
}