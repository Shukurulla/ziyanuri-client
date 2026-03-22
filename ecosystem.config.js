module.exports = {
  apps: [{
    name: "ziyanuri-client",
    script: "npx",
    args: "serve dist -l 3000 -s",
    cwd: "/root/shukurulla/ziyanuri-client",
    env: {
      PM2_SERVE_SPA: "true",
    },
  }],
};
