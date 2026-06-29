require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'kasir-app',
      script: '.output/server/index.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
    },
  ],
}
