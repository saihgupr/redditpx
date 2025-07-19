

# redditpx - A fast, modern alternative to redditp.com

redditpx is a fast & fun way to make slideshows out of reddit.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

You'll need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/get-npm) installed on your machine.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/saihgupr/redditpx.git
   ```
2. Navigate to the project directory
   ```sh
   cd redditpx
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

### Usage

To run the app in development mode:
```sh
npm run dev
```
This will start a development server, usually at `http://localhost:3000`.

To create a production version of the app:
```sh
npm run build
```

To run the production version:
```sh
npm run start
```

To create a static version of the site that can be hosted on any static web server:
```sh
npm run export
```
The static files will be located in the `__sapper__/export` directory.

## New Features

- [x] Up arrow for next post/album
- [x] Down arrow for previous post/album
- [x] Hide UI is on by default
- [x] Autoplay is on by default
- [x] F for fullscreen
- [x] Mouse wheel for next/previous post/album
- [x] Cursor hides when UI is hidden


## Features

redditpx has the following features

- [x] better mobile mode
- [x] scrolling grid view
- [x] hover preview
- [x] filtering
- [x] favorite
- [x] batch download
- [x] fast and modern code
- [x] user profile
- [x] /r/random and /r/randnsfw
- [x] filter images, videos or both
- [x] search subreddits
- [ ] customizable keyboard shortcuts

.. in addition to the features it shares with redditp

- [x] multireddit
- [x] autoplay on/off
- [x] nsfw on/off
- [x] direct open fullimage
- [x] keyboard shortcuts
- [x] open reddit post and comments
- [x] /new, /top, /hot support
- [x] /domain, /user, /u support

## Keybindings

| Action                                                             | Binding                                 |
| ------------------------------------------------------------------ | --------------------------------------- |
| <kbd>Left</kbd>, <kbd>a</kbd>, <kbd>k</kbd>, <kbd>Page up</kbd>    | Previous                                |
| <kbd>Right</kbd>, <kbd>d</kbd>, <kbd>j</kbd>, <kbd>Page down</kbd> | Next                                    |
| <kbd>Up</kbd>                                                      | Album next                              |
| <kbd>Down</kbd>                                                    | Album previous                          |
| <kbd>Scroll Down</kbd>                                             | Next                                    |
| <kbd>Scroll Up</kbd>                                               | Previous                                |
| <kbd>m</kbd>                                                       | Add/Remove from multi-reddit            |
| <kbd>s</kbd>                                                       | Sound on/off                            |
| <kbd>q</kbd>, <kbd>p</kbd>                                         | Autoplay on/off                         |
| <kbd>f</kbd>                                                       | Toggle fullscreen                       |
| <kbd>/</kbd>                                                       | Filter posts                            |
| <kbd>x</kbd>                                                       | Toggle favorites                        |
| <kbd>r</kbd>                                                       | Open post on reddit.com                 |
| <kbd>o</kbd>                                                       | Open post on old.reddit.com             |
| <kbd>i</kbd>                                                       | Open direct link to media (image,video) |
| <kbd>l</kbd>                                                       | Open duplicates                         |
| <kbd>h</kbd>                                                       | Toggle UI visibility                    |
| <kbd>g</kbd>                                                       | Toggle layout (grid/fullscreen)         |
| <kbd>v</kbd>                                                       | Toggle image/video                      |
| <kbd>c</kbd>                                                       | Copy direct media link to clipboard     |

## Acknowledgements

This project is a fork of [redditpx](https://github.com/jeffjose/redditpx) by [jeffjose](https://github.com/jeffjose), which is itself a fork of [redditp](https://github.com/ubershmekel/redditp) by [ubershmekel](https://github.com/ubershmekel). Both projects are licensed under the MIT License.

- svelte/sapper for framework
- twemoji for images
- favicon.io for favicons