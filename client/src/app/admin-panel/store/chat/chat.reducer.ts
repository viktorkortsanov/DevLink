import { createReducer, on } from '@ngrx/store';
import * as ChatActions from './chat.actions';
import { initialChatState } from './chat.state';

export const chatReducer = createReducer(
  initialChatState,

  // Loading chat history
  on(ChatActions.loadChatHistory, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(ChatActions.loadChatHistorySuccess, (state, { messages }) => ({
    ...state,
    messages,
    isLoading: false
  })),

  on(ChatActions.loadChatHistoryFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),

  // Sending messages
  on(ChatActions.sendMessage, (state) => ({
    ...state,
    isSending: true,
    error: null
  })),

  on(ChatActions.sendMessageSuccess, (state) => ({
    ...state,
    currentMessage: '',
    isSending: false
  })),

  on(ChatActions.sendMessageFailure, (state, { error }) => ({
    ...state,
    error,
    isSending: false
  })),

  // Receiving messages
  on(ChatActions.messageReceived, (state, { message }) => ({
    ...state,
    messages: [...state.messages, message]
  })),

  // Input management
  on(ChatActions.updateCurrentMessage, (state, { message }) => ({
    ...state,
    currentMessage: message
  })),

  // Connection status
  on(ChatActions.socketConnected, (state) => ({
    ...state,
    isConnected: true
  })),

  on(ChatActions.socketDisconnected, (state) => ({
    ...state,
    isConnected: false
  })),

  // Clear chat
  on(ChatActions.clearChatSuccess, (state) => ({
    ...state,
    messages: []
  }))
);