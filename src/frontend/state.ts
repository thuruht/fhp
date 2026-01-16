// src/frontend/state.ts

type Page = 'home' | 'videos' | 'stills' | 'contact' | 'admin' | 'login';

export interface AppState {
    page: Page;
    isAuthenticated: boolean;
    data: {
        announcements: any[];
        videos: any[];
        stills: any[];
    };
}

const initialState: AppState = {
    page: 'home',
    isAuthenticated: false,
    data: {
        announcements: [],
        videos: [],
        stills: [],
    },
};

let state: AppState = { ...initialState };
const listeners: (() => void)[] = [];

export const getState = () => state;

export const setState = (newState: Partial<AppState>) => {
    state = { ...state, ...newState };
    listeners.forEach(l => l());
};

export const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};
