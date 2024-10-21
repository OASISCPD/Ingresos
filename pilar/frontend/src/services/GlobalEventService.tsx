let refreshCallbacks: (() => void)[] = [];

export function subscribeToRefreshEvent(callback: () => void) {
    refreshCallbacks.push(callback);
}

export function unsubscribeFromRefreshEvent(callback: () => void) {
    refreshCallbacks = refreshCallbacks.filter(cb => cb !== callback);
}

export function emitRefreshEvent() {
    refreshCallbacks.forEach(callback => callback());
}
