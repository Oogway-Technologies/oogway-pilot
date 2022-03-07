const fractionWidths = require('tailwindcss-fraction-widths')

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './styles/*.{js,ts}',
    ],
    darkMode: 'class',
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        fontFamily: {
            sans: ['inter'],
            serif: ['inter'],
            display: ['inter'],
            body: ['inter'],
        },
        fontFeatureSettings: {
            numeric: ['tnum', 'salt', 'ss02'],
        },
        extend: {
            spacing: {
                xs: '4px',
                sm: '8px',
                md: '16px',
                lg: '24px',
                xl: '32px',
                xxl: '64px',
                128: '32rem',
                136: '34rem',
                144: '40rem',
            },
            colors: {
                black: '#000000',
                white: '#FFFFFF',
                primaryActive: '#5A34BE',
                // Light
                primary: '#7041EE',
                secondary: '#EA7979',
                alert: '#E77C40',
                error: '#E0232E',
                success: '#2DC071',
                neutral: {
                    25: '#FCFCFC',
                    50: '#F4F4F4',
                    100: '#E5E5E5',
                    150: '#D8D8D8',
                    300: '#BFBFBF',
                    700: '#535353',
                    800: '#1A1A1A',
                },
                // Dark
                primaryDark: '#7269FF',
                secondaryDark: '#FB9393',
                alertDark: '#FB8C4E',
                errorDark: '#FA3541',
                successDark: '#3DDE88',
                neutralDark: {
                    50: '#E4E6EB',
                    150: '#B0B3B8',
                    300: '#3A3B3C',
                    400: '#2E2E2E',
                    500: '#242526',
                    600: '#18191A',
                },
            },
        },
    },
    plugins: [
        require('tailwindcss-font-inter'),
        require('tailwindcss-aria-attributes'),
        require('tailwind-scrollbar-hide'),
    ],
}
