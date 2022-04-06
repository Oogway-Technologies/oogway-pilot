import Document, {
    DocumentContext,
    DocumentInitialProps,
    Head,
    Html,
    Main,
    NextScript,
} from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(
        ctx: DocumentContext
    ): Promise<DocumentInitialProps> {
        const initialProps = await Document.getInitialProps(ctx)

        return initialProps
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:2904321,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
                        }}
                    />
                </Head>
                <body className="bg-neutral-25 dark:bg-neutralDark-600">
                    <Main />
                    <NextScript />
                    <div id="modal" />
                </body>
            </Html>
        )
    }
}

export default MyDocument
