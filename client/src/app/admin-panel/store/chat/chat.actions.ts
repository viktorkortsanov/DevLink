import { createAction, props } from '@ngrx/store';
import { ChatMessage } from './chat.state';

export const loadChatHistory = createAction('[Chat] Load Chat History');
export const loadChatHistorySuccess = createAction('[Chat] Load Chat History Success', props<{messages: ChatMessage[]}>());
export const loadChatHistoryFailure = createAction('[Chat] Load Chat History Failure', props<{error: string}>());

export const sendMessage = createAction('[Chat] Send Message', props<{content: string}>());
export const sendMessageSuccess = createAction('[Chat] Send Message Success');
export const sendMessageFailure = createAction('[Chat] Send Message Failure', props<{error: string}>());

export const messageReceived = createAction('[Chat] Message Received', props<{message: ChatMessage}>());

export const updateCurrentMessage = createAction('[Chat] Update Current Message', props<{message: string}>());

export const socketConnected = createAction('[Chat] Socket Connected');
export const socketDisconnected = createAction('[Chat] Socket Disconnected');

export const clearChat = createAction('[Chat] Clear Chat');
export const clearChatSuccess = createAction('[Chat] Clear Chat Success');