/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                'grey-1': '#464C54',
                'blue-1': '#1E8EF5'
            }
        }
    },
    plugins: []
};
