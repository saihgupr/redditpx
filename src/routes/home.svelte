<script>
  import Icon from "fa-svelte/src/Icon.svelte";
  import { faCog as faSettings } from "@fortawesome/free-solid-svg-icons/faCog";
  import { faReply as faReturn } from "@fortawesome/free-solid-svg-icons/faReply";

  import { faCloudDownloadAlt as faDownload } from "@fortawesome/free-solid-svg-icons/faCloudDownloadAlt";
  import { faEye as faSlideshow } from "@fortawesome/free-solid-svg-icons/faEye";
  import { faTimesCircle as faClose } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
  import { faPlusCircle } from "@fortawesome/free-solid-svg-icons/faPlusCircle";
  import { faStar as faFav } from "@fortawesome/free-solid-svg-icons/faStar";

  import Settings from "../components/Settings.svelte";

  import { goto as ahref } from "@sapper/app";

  import { favorite, multireddit } from "../_prefs";
  favorite.useLocalStorage({});
  multireddit.useLocalStorage({});

  let showSettings = false;

  let exploreSubreddits = [
    { color: "lightpink", url: "r/pics" },
    { color: "lightsalmon", url: "r/aww" },
    { color: "peachpuff", url: "r/wallpapers" },
    { color: "lavender", url: "r/earthporn" },
    { color: "palegreen", url: "r/dataisbeautiful" },
    { color: "turquoise", url: "r/oldschoolcool" },
    { color: "wheat", url: "r/reactiongifs" },
    { color: "lightskyblue", url: "r/foodporn" },
    { color: "tomato", url: "r/itookapicture" }
  ];

  function toggleSettings() {
    showSettings = !showSettings;
  }

  function goBack() {
    window.history.back();
  }

  let displayposts = [];
  let mreddits = [];

  $: displayposts = $favorite ? Object.entries($favorite) : [];
  $: mreddits = $multireddit ? Object.entries($multireddit) : [];
  $: slideshowurl = $multireddit
    ? `/r/${Object.keys($multireddit).join("+")}`
    : "";

  async function downloadFiles() {
    window.open("/download", "_blank");
  }

  function openSlideshow() {
    ahref(slideshowurl);
  }

  function removeFav(url) {
    $favorite[url] = undefined;
    $favorite = JSON.parse(JSON.stringify($favorite));

    favorite.set($favorite);
  }
</script>

<svelte:head>
  <title>redditpx - home</title>
</svelte:head>

<template lang="pug">
.wrapper
  .hero
    .title
      span.logo
        img(alt="redditpx logo", src="logo-192.png")
      | redditpx
    .settings
      span.btn(on:click='{goBack}')
        Icon(icon="{faReturn}")
      span.btn(on:click='{toggleSettings}', class:showSettings='{showSettings}')
        Icon(icon="{faSettings}")
      Settings('{showSettings}')
    .block.multireddit
      .heading Multireddit {"(" + mreddits.length + ")"}
        +if('mreddits.length')
          span.icon.tooltip(on:click="{openSlideshow}", data-tooltip="start slideshow", class:favorite='{mreddits.length}')
            Icon(icon="{faSlideshow}")
      .items
        +each('mreddits as [mreddit, mrdetails]')
          .itemwrapper
            a(href='{`/r/${mreddit}`}', rel="prefetch")
              .item(style='background-image: url("{mrdetails.preview}")' )
                span {"r/" + mreddit}
          +else()
            .itemwrapper.noitems
              .item
                span Add to multireddit using
                span.inlineicon
                  Icon(icon="{faPlusCircle}")
                span or using shortcut
                span.key m
    .block.favs
      .heading Favorites {"(" + displayposts.length + ")"}
        +if('displayposts.length')
          span.icon.tooltip(on:click="{downloadFiles}", data-tooltip="download all", class:favorite='{displayposts.length}')
            Icon(icon="{faDownload}")
      .items
        +each('displayposts as [url, post]')
          .itemwrapper
            span.icon.tooltip(on:click|stopPropagation|preventDefault="{function() {removeFav(url)}}", data-tooltip="remove")
              Icon(icon="{faClose}")
            a(href='{post.url}', target='_blank')
              .item(style='background-image: url("{post.preview.img.default}")' )
                a.subreddit(href='{`/r/${post.subreddit}`}')
                  span {"r/" + post.subreddit}
          +else()
            .itemwrapper.noitems
              .item
                span Add to favorites using
                span.inlineicon
                  Icon(icon="{faFav}")
                span or using shortcut
                span.key x
    .block.explore
      .heading Explore
      .items
        +each('exploreSubreddits as subreddit')
          .itemwrapper.explore
            a(href='{`/${subreddit.url}`}', rel="prefetch")
              .item(style='background-color: {subreddit.color}' )
                span {subreddit.url}
      .links
        a(href='/m/subreddit')
        a(href='/r/subreddit')
        a(href='/r/subreddit/search')
        a(href='/r/subreddit/hot')
        a(href='/r/subreddit/top')
        a(href='/r/subreddit/new')
        a(href='/domain/domainname')
        a(href='/u/username')
        a(href='/user/username')
        a(href='/random')
        a(href='/randnsfw')
        a(href='/download')
        a(href='/gfycat.com/user')
        a(href='/gfycat.com/user/collections/collection/collectionname')
        a(href='/imgur.com/a/albumname')
        a(href='/imgur.com/gallery/galleryname')
        a(href='/gettyimages.com/photos/query')
</template>

<style lang="sass">

@mixin hover()
  @media not all and (pointer:coarse)
    &:hover
      @content

$yellow: #f9ab00

$text-color: #fafafa
$accent-color: white
$favorite-color: #fbbc04
$favorite-border-color: #e37400
$over18-color: #ea4335
$over18-border-color: #ea4335


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
      top: 1rem
      right: 1rem
      color: $text-color
      font-size: 1rem
      display: flex
      align-items: center

      .btn
        user-select: none
        margin-left: 10px
        cursor: pointer
        font-size: 1.2rem
        color: white
        background-color: rgba(26, 26, 26, 0.95)
        backdrop-filter: blur(20px)
        border-radius: 12px
        transition: all 0.2s ease
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3)
        padding: 10px
        display: flex
        align-items: center
        justify-content: center
        width: 40px
        height: 40px

        &.showSettings
          color: white

        @include hover()
          background-color: rgba(34, 34, 34, 0.95)
          transform: scale(1.05)

    .title
      z-index: 10
      position: absolute
      top: 0
      color: $text-color
      font-size: 1.5rem
      max-width: 90%
      padding: 1rem
      border-radius: 3px
      cursor: pointer

      .logo
        user-select: none
        cursor: pointer
        top: 5px
        position: relative
        margin-right: 9px

        img
          height: 2rem
    .block
      color: $text-color
      padding: 1rem
      width: 100%
      align-self: start

      .heading
        font-size: 1.5rem

        .icon
          top: 3px
          position: relative
          margin-left: 8px

          &.favorite
            color: $favorite-color

      .links
        display: none

      .items
        display: grid
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))
        grid-gap: 10px
        margin-top: 5px

        .itemwrapper

          &.explore
            .item
              height: 5rem

          &.noitems
            color: darken($text-color, 30%)
            background-color: lighten(black, 10%)
            grid-column: 1 / -1
            border-radius: 3px
            margin-top: 1rem
            display: grid
            justify-content: center

            .item
              padding: 4rem

              .inlineicon
                margin: 0 4px
                top: 2px
                position: relative
                color: white

              .key
                color: darken($text-color, 30%)
                margin: 0 4px
                border: 1px solid darken($text-color, 30%)
                border-radius: 3px
                top: -1px
                position: relative
                line-height: 1.3rem
                padding: 0 5px


          @include hover()
            .icon
              opacity: 1

          @include hover()
            span
              opacity: 1 !important


          .icon
            position: relative
            float: right
            margin: 1.1rem
            opacity: 0
            color: $favorite-color
            font-size: 1.3rem

          a
            color: $text-color
            text-decoration: none

            .item
              padding: 1rem
              height: 10rem
              background-size: cover
              background-position: center
              border-radius: 3px

              & .subreddit
                span
                  opacity: 0

              span
                background-color: black
                padding: 0.3rem
                border-radius: 3px


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
