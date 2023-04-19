/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/app.component.{html,ts}',
    './src/app/Auth/login/login.component.{html,ts}',
    './src/app/Auth/register/register.component.{html,ts}',
    './src/app/profile/components/profile/profile.component.{html,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

