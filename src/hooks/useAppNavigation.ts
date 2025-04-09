import { useRouter } from 'expo-router';

// The simplest possible implementation that should work with TypeScript
export function useAppNavigation() {
    return useRouter();
}