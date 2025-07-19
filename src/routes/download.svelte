<script>
  import Icon from "fa-svelte/src/Icon.svelte";
  import { faCloudDownloadAlt as faDownload } from "@fortawesome/free-solid-svg-icons/faCloudDownloadAlt";
  import { faCog as faSettings } from "@fortawesome/free-solid-svg-icons/faCog";
  import { faHome } from "@fortawesome/free-solid-svg-icons/faHome";

  import Settings from "../components/Settings.svelte";

  import { favorite } from "../_prefs";
  favorite.useLocalStorage({});

  let filterValue;
  let displayposts;

  let showSettings = false;

  function toggleSettings() {
    showSettings = !showSettings;
  }

  $: {
    let tmp;
    if (filterValue) {
      tmp = Object.entries($favorite).filter((item) => {
        let details = item[1];

        // poor mans search
        // Find all the `values`, make a giant string and substring match
        return Object.values(details).join(" ").includes(filterValue);
      });
      displayposts = tmp;
    } else {
      displayposts = $favorite ? Object.entries($favorite) : [];
    }
  }
</script>

<svelte:head>
  <title>redditpx - download</title>
</svelte:head>

<template lang="pug">
.wrapper
  .hero
    .title
      span.logo
        img(alt="redditpx logo", src="logo-192.png")
      | redditpx download {$favorite ? `(${Object.keys($favorite).length} items)` : '' }
      .subtitle
        p.sub Right click on the page (not on any image) > Save as > Select "Webpage, Complete".
        p.sub Alternatively, hit Ctrl+S > Select "Webpage, Complete"
      .filter
        span Filter ({displayposts.length})
        input(bind:value='{filterValue}', type="text")
    .settings
      a.home(rel="prefetch", href="/home")
        span.btn.tooltip(data-tooltip="Home")
          Icon(icon="{faHome}")

      span.btn(on:click='{toggleSettings}', class:showSettings='{showSettings}')
        Icon(icon="{faSettings}")
      Settings('{showSettings}')

    .imgwrapper
      +each('displayposts as [url, post]')
        +if('post.is_album')
          +each('post.preview.img.album as album')
            +if('album.is_image')
              .media
                img(alt="image", src='{album.hires}')
              +else()
                .media
                  video(autoplay, loop, playsinline, muted)
                    source(src="{album.hires}")
          +elseif('post.is_image')
            .media
              img(alt="image", src='{url}')
          +elseif('post.is_video')
            .media
              video(autoplay, loop, playsinline, muted)
                +if('post.preview.vid.webm')
                  source(src="{post.preview.vid.webm}")
                +if('post.preview.vid.mp4')
                  source(src="{post.preview.vid.mp4}")
</template>

<style lang="sass">
@mixin hover()
  @media not all and (pointer:coarse)
    &:hover
      @content

$text-color: #fafafa

.wrapper
  height: 100vh

  display: grid
  justify-items: center
  align-items: center

  .hero
    height: 100vh
    width: 100%
    display: grid
    justify-items: center
    align-items: center
    grid-auto-rows: max-content
    grid-row-gap: 3rem
    padding-top: 5rem

    .settings
      z-index: 10
      position: absolute
      top: 0
      right: 0
      color: $text-color
      font-size: 1rem
      padding: 1.5rem

      .home
        margin-right: 7px

      .btn
        user-select: none
        cursor: pointer
        color: rgba(white, 80%)

        &.showSettings
          color: white

        @include hover()
          color: white

    .title
      z-index: 10
      position: absolute
      top: 0
      background-color: rgba(0, 0, 0, 0.4)
      color: $text-color
      font-size: 1.5rem
      padding: 1rem
      border-radius: 3px
      cursor: pointer

      @include hover()
        background-color: rgba(0, 0, 0, 0.8)

      .logo
        user-select: none
        cursor: pointer
        top: 5px
        position: relative
        margin-right: 9px

        img
          height: 2rem

      :global(svg)
        margin-right: 10px
        top: 3px
        position: relative

      .subtitle
        margin-top: 1rem
        font-size: 1rem
        color: darken($text-color, 10%)

        p.sub
          margin: 0

      .filter
        span
          font-size: 1rem
          margin-right: 10px

        input
          padding-left: 5px
          padding-right: 5px
          border: 1px solid rgba(white, 60%)
          background-color: rgba(0, 0, 0, 0)
          color: white
          height: 1.5rem

    .imgwrapper
      display: grid
      grid-gap: 2rem
      justify-content: center
      align-content: center

      .media
        justify-self: center

        img
          max-width: 100%

        video
          max-width: 100%

.tooltip
  position: relative
  z-index: 2
  cursor: pointer

.tooltip
  &:before, &:after
    visibility: hidden
    opacity: 0
    pointer-events: none

  &:before
    position: absolute
    bottom: 120%
    left: 50%
    margin-bottom: 5px
    margin-left: -30px
    padding: 5px 4px
    width: 60px
    border-radius: 3px
    background-color: black
    color: #fff

    background-color: rgba(white, 90%)
    color: black

    content: attr(data-tooltip)
    text-align: center
    font-size: 0.8rem
    line-height: 1.2

  &:after
    position: absolute
    bottom: 120%
    left: 50%
    margin-left: -5px
    width: 0
    border-top: 5px solid #000
    border-top: 5px solid hsla(0, 0%, 20%, 0.9)
    border-right: 5px solid transparent
    border-left: 5px solid transparent
    content: " "
    font-size: 0
    line-height: 0

  &:hover
    &:before, &:after
      visibility: visible
      opacity: 1

</style>
