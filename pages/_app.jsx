import { useMemo } from 'react';
import Head from 'next/head';
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
    SolflareWalletAdapter,
    TorusWalletAdapter,
    LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import "@solana/wallet-adapter-react-ui/styles.css";
import '../src/index.css';

export default function MyApp({ Component, pageProps }) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const endpoint = process.env.NEXT_PUBLIC_SOL_RPC;

    // Configure supported wallets
    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
        ],
        []
    );

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>DOCAL AI</title>
            </Head>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets} autoConnect>
                    <WalletModalProvider>
                        <Component BASE_URL={BASE_URL} {...pageProps} />
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
}
