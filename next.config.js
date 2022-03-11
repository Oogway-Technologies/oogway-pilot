/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: false,
    images: {
        domains: ['firebasestorage.googleapis.com', 'avatars.dicebear.com'],
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
