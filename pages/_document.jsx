import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Keep only tags that must be in every page */}
                    <link
                        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@100;200;300;400;500;600;700&family=Inter:wght@100..900&display=swap"
                        rel="stylesheet"
                    />
                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href={`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/assets/logo-light.png`}
                        sizes="96x96"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
