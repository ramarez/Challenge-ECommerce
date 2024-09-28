/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    theme: {
        extend: {
            minHeight: {
                'screen-85': '85vh',
                'screen-90': '90vh'
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}

