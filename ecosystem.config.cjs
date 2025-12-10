module.exports = {
  apps: [
    {
      name: "paladino",
      cwd: "/var/www/paladino",
      script: "node",
      args: "./node_modules/next/dist/bin/next start -p 3001 -H 127.0.0.1",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
