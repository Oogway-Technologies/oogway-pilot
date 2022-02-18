/**
 *  Setup default options for react query client
 *
 *  For important information on defaults see:
 * https://react-query.tanstack.com/guides/important-defaultshttps://react-query.tanstack.com/guides/important-defaults
 */

export const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000, // Set to 30 seconds by default
        },
    },
}
