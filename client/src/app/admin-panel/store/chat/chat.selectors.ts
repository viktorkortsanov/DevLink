import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ChatState } from './chat.state';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectChatMessages = createSelector(
  selectChatState,
  (state) => state.messages
);

export const selectCurrentMessage = createSelector(
  selectChatState,
  (state) => state.currentMessage
);

export const selectIsSending = createSelector(
  selectChatState,
  (state) => state.isSending
);

export const selectIsLoading = createSelector(
  selectChatState,
  (state) => state.isLoading
);

export const selectIsConnected = createSelector(
  selectChatState,
  (state) => state.isConnected
);

export const selectChatError = createSelector(
  selectChatState,
  (state) => state.error
);