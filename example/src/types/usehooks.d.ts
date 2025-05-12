declare module '@uidotdev/usehooks' {
  export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void];
  // Add other hooks as needed
}