# SnoozeStrap

## Development Set-up

1. Run `$> npm install` to install dependencies.
2. Run `$> gulp copy-assets` to copy assets from modules.
5. Run `$> gulp watch` to compile SCSS, JS and PUG files as you code.
6. Run `$> gulp watch-bs` to enable browser-sync & compile SCSS and JS files as you code.

## Images

1. Run `$> gulp copy-img` to copy images form `./src` to `./dist`.
2. Run `$> gulp imagemin` to minify images in `./dist/img`.

## Deploy

Copy contents of `/dist` to FTP server to deploy.

## Release

Run `$> gulp release` to zip contents of `./dist`.
