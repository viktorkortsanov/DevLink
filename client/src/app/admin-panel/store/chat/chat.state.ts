export interface ChatMessage {
    content: string;
    timestamp: Date;
    username: string;
    profileImage: string | null;
    adminId: string;
}

export interface ChatState {
    messages: ChatMessage[];
    currentMessage: string;
    isSending: boolean;
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
}

export const initialChatState: ChatState = {
    messages: [],
    currentMessage: '',
    isSending: false,
    isLoading: false,
    isConnected: false,
    error: null
};