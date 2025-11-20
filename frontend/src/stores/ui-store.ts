import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  chatOpen: boolean;
  isRecording: boolean;
  currentSessionId: string | null;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleChat: () => void;
  setChatOpen: (open: boolean) => void;
  setRecording: (recording: boolean) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  chatOpen: false,
  isRecording: false,
  currentSessionId: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  setChatOpen: (open) => set({ chatOpen: open }),
  setRecording: (recording) => set({ isRecording: recording }),
  setCurrentSessionId: (sessionId) => set({ currentSessionId: sessionId }),
}));
