/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    images: {
        domains: ['firebasestorage.googleapis.com', 'avatars.dicebear.com'],
    },
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
        ADVICEBOT_ID: process.env.ADVICEBOT_ID,
        DEMO_ACCOUNT_ID: process.env.DEMO_ACCOUNT_ID,
    },
    async redirects() {
        return [
            {
                source: '/social',
                destination: '/',
                permanent: true,
            },
        ]
    },
}
