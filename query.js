/**
 *  Setup default options for react query client
 *
 *  For important information on defaults see:
 * https://react-query.tanstack.com/guides/important-defaultshttps://react-query.tanstack.com/guides/important-defaults
 */

export const queryClientConfig = {
    defaultOptions: {
        queries: {
            staleTime: 20 * 60 * 1000, // Set to 20 minutes by default
        },
    },
}
