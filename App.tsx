import PlaidProvider from '@/modules/plaid/PlaidProvider';

export default function RootLayout() {
    return (
        <PlaidProvider>
            <Slot />
        </PlaidProvider>
    );
}
