import { writable } from 'svelte/store';

function createAuthStore() {
    const { subscribe, set, update } = writable({
        isLoggedIn: false,
        user: null
    });

    return {
        subscribe,
        login: (userData) => update(state => ({ isLoggedIn: true, user: userData })),
        logout: () => set({ isLoggedIn: false, user: null }),
        setUser: (userData) => update(state => ({ ...state, user: userData }))
    };
}

export const auth = createAuthStore();
