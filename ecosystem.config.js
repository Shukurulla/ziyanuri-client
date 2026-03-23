module.exports = {
  apps: [{
    name: "ziyanuri-client",
    script: "npx",
    args: "serve dist -l 4173 -s --listen 0.0.0.0",
    cwd: "/root/shukurulla/ziyanuri-client",
    env: {
      PM2_SERVE_SPA: "true",
    },
  }],
};
