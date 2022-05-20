/* eslint-disable @next/next/next-script-for-ga */
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
                            h._hjSettings={hjid:2959971,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
                        }}
                    />
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','GTM-TCRRCW8');`,
                        }}
                    />
                </Head>
                <body className="bg-neutral-25 dark:bg-neutralDark-600">
                    <noscript>
                        <iframe
                            src="https://www.googletagmanager.com/ns.html?id=GTM-TCRRCW8"
                            height="0"
                            width="0"
                            style={{ display: 'none', visibility: 'hidden' }}
                        />
                    </noscript>
                    <Main />
                    <NextScript />
                    <div id="modal" />
                </body>
            </Html>
        )
    }
}

export default MyDocument
