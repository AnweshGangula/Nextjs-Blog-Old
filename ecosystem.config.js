// Reference: https://stackoverflow.com/a/69779272/6908282
// LINUX StartUp Command: pm2 --no-daemon start /home/site/wwwroot/ecosystem.config.js

module.exports = {
    apps: [
        {
            name: "my-nextJs-site",
            script: "./node_modules/next/dist/bin/next",
            args: "start -p " + (process.env.PORT || 3000),
            watch: false,
            autorestart: true,
        },
    ],
};