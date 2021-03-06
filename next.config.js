/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    images: {
        domains: ['firebasestorage.googleapis.com', 'avatars.dicebear.com'],
    },
    env: {
        SERVICE_ENCRYPTION_IV: process.env.SERVICE_ENCRYPTION_IV,
        SERVICE_ENCRYPTION_KEY: process.env.SERVICE_ENCRYPTION_KEY,
        SERVICE_DECRYPTION_KEY: process.env.SERVICE_DECRYPTION_KEY,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    async redirects() {
        return [
            {
                source: '/social',
                destination: '/feed',
                permanent: true,
            },
            {
                source: '/decisionengine',
                destination: '/',
                permanent: true,
            },
        ]
    },
}
