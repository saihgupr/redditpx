<script>
  import Icon from "fa-svelte/src/Icon.svelte";
  import { faCog as faSettings } from "@fortawesome/free-solid-svg-icons/faCog";
  import { faTimes as faClose } from "@fortawesome/free-solid-svg-icons/faTimes";

  export let showSettings;

  import {
    autoplayinterval,
    scrollspeed,
    prefetch,
    prefetchNum,
    numCols,
    hires,
    lores,
    oldreddit,
    viewMode,
    muted,
    multireddit,
    autoHideUI,
    blockedUsers,
    galleryScrollDir
  } from "../_prefs";
  autoplayinterval.useLocalStorage(3);
  scrollspeed.useLocalStorage(2);
  prefetch.useLocalStorage(true);
  prefetchNum.useLocalStorage(50);
  numCols.useLocalStorage(3);
  hires.useLocalStorage(false);
  lores.useLocalStorage(false);
  oldreddit.useLocalStorage(false);
  viewMode.useLocalStorage(0);
  muted.useLocalStorage(true);
  multireddit.useLocalStorage({});
  autoHideUI.useLocalStorage(false);
  blockedUsers.useLocalStorage({});
  galleryScrollDir.useLocalStorage(0);

  function hideSettings() {
    showSettings = false;
  }

  let activeTab = 1;

  let showMultiredditPopup = false;
  let multiredditInput = "";

  function openMultiredditPopup() {
    multiredditInput = $multireddit ? Object.keys($multireddit).join("+") : "";
    showMultiredditPopup = true;
  }

  function saveMultireddit() {
    const subs = multiredditInput.split("+").map(s => s.trim()).filter(s => s);
    const newStore = {};
    subs.forEach(sub => {
      if ($multireddit && $multireddit[sub]) {
        newStore[sub] = $multireddit[sub];
      } else {
        newStore[sub] = { preview: "" };
      }
    });
    multireddit.set(newStore);
    showMultiredditPopup = false;
  }

  function closeMultiredditPopup() {
    showMultiredditPopup = false;
  }

  let _autoplayinterval = $autoplayinterval;
  let _scrollspeed = $scrollspeed;
  let _hires = $hires;
  let _lores = $lores;
  let _oldreddit = $oldreddit;
  let _prefetch = $prefetch;
  let _prefetchNum = $prefetchNum;
  let _numCols = $numCols;
  let _muted = $muted;
  let _viewMode = $viewMode;
  $: _viewMode = $viewMode;
  let _autoHideUI = $autoHideUI;

  $: {
    let i = Math.round(_autoplayinterval);
    if (i) {
      autoplayinterval.set(i);
    }

    let j = Math.round(_scrollspeed);
    if (j >= 20) {
      scrollspeed.set(10);
    } else {
      scrollspeed.set(j);
    }

    let k = Math.round(_prefetchNum);
    if (k) {
      prefetchNum.set(k);
    }

    let l = Math.round(_numCols);
    if (l) {
      numCols.set(l);
    }
  }

  function toggleOldReddit() {
    _oldreddit = !_oldreddit;

    oldreddit.set(_oldreddit);
  }


  function toggleViewMode() {
    viewMode.set($viewMode === 0 ? 1 : 0);
  }

  function toggleGalleryScrollDir() {
    galleryScrollDir.set($galleryScrollDir === 0 ? 1 : 0);
  }

  function toggleHiRes() {
    _hires = !_hires;

    hires.set(_hires);
  }

  function toggleLoRes() {
    _lores = !_lores;

    lores.set(_lores);
  }

  function togglePrefetch() {
    _prefetch = !_prefetch;

    prefetch.set(_prefetch);
  }

  function toggleMuted() {
    _muted = !_muted;

    muted.set(_muted);
  }

  function toggleAutoHideUI() {
    _autoHideUI = !_autoHideUI;

    autoHideUI.set(_autoHideUI);
  }

  function unblock(user) {
    const updated = { ...$blockedUsers };
    delete updated[user];
    blockedUsers.set(updated);
  }
</script>

<template lang="pug">
.settingspanel(class:showSettings='{showSettings}')
  .head
    Icon(icon="{faSettings}")
    | Settings
  .close(on:click='{hideSettings}')
    Icon(icon="{faClose}")
  .contents
    .nav
      div(class:active='{activeTab == 1}', on:click='{function(){activeTab = 1}}') General
      div(class:active='{activeTab == 2}', on:click='{function(){activeTab = 2}}') Keybindings
      div(class:active='{activeTab == 3}', on:click='{function(){activeTab = 3}}') Blocked Users
    .options
      div.option(class:active='{activeTab == 1}')
        //p autoplay on/off
        //p download files
        //p nsfw on/off
        .item
          span.text Autoplay time (seconds)
          span.input
            input(type="number", bind:value='{_autoplayinterval}')
        .item
          span.text Scroll speed (0-20)
          span.input
            input(type="number", bind:value='{_scrollspeed}')
        //.item
        //  span Favorite
        //    span
        //      span.button Mark all
        //      span.button Unmark all
        //      span.button Unmark all (all subreddits)
        .item
          span.tooltip(data-tooltip="Preload media in the background") Prefetch media
          span
            span.button(on:click='{togglePrefetch}') {_prefetch ? "Prefetch is on" : "Prefetch is off"}
        .item
          span.text Prefetch items
          span.input
            input(type="number", bind:value='{_prefetchNum}')
        .item
          span.text Number of columns in grid mode
          span.input
            input(type="number", bind:value='{_numCols}')
        .item
          span.tooltip(data-tooltip="Sound on/off") Sound
          span
            span.button(on:click='{toggleMuted}') {_muted ? "Sound is off" : "Sound is on"}
        .item
          span.text.tooltip(data-tooltip="Choose what type of image to display") Display image resolution
          span
            span.button(on:click='{toggleHiRes}') {_hires ? "Original (slow)" : "Optimized (fast)"}
        .item
          span.text.tooltip(data-tooltip="Choose what type of video to display") Display video resolution
          span
            span.button(on:click='{toggleLoRes}') {_lores ? "Prefer lo-res (fast)": "Original (slow)"}
        .item
          span.text.tooltip(data-tooltip="Choose whether to go to reddit.com or old.reddit.com") reddit.com link handling
          span
            span.button(on:click='{toggleOldReddit}') {_oldreddit ? "old.reddit.com" : "reddit.com (New)"}

        .item
          span.text.tooltip(data-tooltip="Choose whether to show posts as a slideshow or gallery grid") Layout mode
          span
            span.button(on:click='{toggleViewMode}') {_viewMode == 0 ? "Slideshow" : "Gallery"}
        .item
          span.text.tooltip(data-tooltip="In Gallery mode, scroll direction for the image pile") Gallery scroll direction
          span
            span.button(on:click='{toggleGalleryScrollDir}') {$galleryScrollDir === 0 ? "Vertical (scroll down)" : "Horizontal (scroll right)"}
        .item
          span.text.tooltip(data-tooltip="Automatically hide UI when cursor moves (and show again when moving)") Auto-hide UI on cursor movement
          span
            span.button(on:click='{toggleAutoHideUI}') {_autoHideUI ? "Auto-hide is on" : "Auto-hide is off"}
        .item
          span.text Edit Multireddits
          span
            span.button(on:click='{openMultiredditPopup}') Edit
        //p remove duplicates
        //p aggressive caching (thumb vs preview)
      div.option(class:active='{activeTab == 2}')
        .item
          span.text Play / Pause
          span.key q
          span.key p
        .item
          span.text Next item
          span.key Space
          span.key Right
          span.key d
          span.key j
          span.key Page-down
        .item
          span.text Previous item
          span.key Left
          span.key a
          span.key k
          span.key Page-up
        .item
          span.text Next item in the album
          span.key Up
        .item
          span.text Previous item in the album
          span.key Down
        .item
          span.text Hide UI / Controls
          span.key h
        .item
          span.text Toggle favorite
          span.key x
        .item
          span.text Block user
          span.key b
        .item
          span.text Toggle Sound
          span.key m
        .item
          span.text Remove all favorites
          span.key Shift + x
        .item
          span.text Remove all favorites (across all subreddits)
          span.key Ctrl + Shift + x
        .item
          span.text Filter
          span.key /
          span.key f
        .item
          span.text Open reddit (old.reddit.com)
          span.key o
        .item
          span.text Open reddit
          span.key r
        .item
          span.text Open high-res
          span.key i
        .item
          span.text Add to multireddit
          span.key s
      div.option(class:active='{activeTab == 3}')
        +if('Object.keys($blockedUsers).length === 0')
          .no-blocked
            p No blocked users
          +else()
            .blocked-list
              +each('Object.keys($blockedUsers) as user (user)')
                .blocked-user-item
                  span.username u/{user}
                  span.button.unblock-btn(on:click='{function(){unblock(user)}}') Unblock
  .multireddit-popup(class:show='{showMultiredditPopup}')
    .popup-content
      h3 Edit Multireddits
      p Enter subreddits separated by '+'
      textarea(bind:value='{multiredditInput}', placeholder="aww+funny")
      .buttons
        span.button(on:click='{saveMultireddit}') Save
        span.button(on:click='{closeMultiredditPopup}') Cancel
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

.settingspanel
  position: fixed
  background-color: #1a1a1a
  left: 50%
  top: 50%
  transform: translate(-50%, -50%)
  width: 800px
  height: 520px
  border-radius: 12px
  border: none
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4)
  backdrop-filter: blur(20px)
  padding: 0
  display: none
  overflow: hidden
  z-index: 9999

  grid-template-rows: [head-start] 60px [head-end contents-start] 1fr [contents-end]

  &.showSettings
    display: grid
    grid-gap: 0

  .contents
    grid-row: contents
    display: grid
    grid-template-columns: 180px 1fr
    overflow: hidden
    user-select: none
    background-color: #1a1a1a

    .nav
      font-size: 14px
      font-weight: 400
      background-color: #222
      border-right: 1px solid #333
      padding: 20px 0
      display: flex
      flex-direction: column
      gap: 0
      align-items: stretch

      // flow items one below other
      // grid-auto-flow: row

      .active
        background-color: #2a2a2a
        color: #fff
        border-left-color: $yellow

      div
        padding: 12px 20px
        cursor: pointer
        transition: all 0.2s ease
        color: #ccc
        border-left: 3px solid transparent
        width: 100%
        height: auto
        border-bottom: none

        @include hover()
          background-color: #2a2a2a
          color: #fff

    .options
      background-color: #1a1a1a
      border-left: none
      overflow-y: auto
      padding: 15px 20px 10px 20px
      max-height: 100%

      .option
        display: none
        padding: 0rem 1rem

        .item
          padding: 0.5rem
          margin: 0.5rem 0

          .text
            margin-right: 10px

          .key
            color: $yellow
            margin: 0 4px
            border: 1px solid $yellow
            border-radius: 3px
            padding: 4px 5px

          .input
            input
              border: 1px solid white
              background-color: rgba(black, 0)
              color: white
              padding: 5px
              width: 100px

          .button
            border: 1px solid white
            margin: 0 5px
            padding: 5px
            border-radius: 3px
            cursor: pointer

            @include hover()
              background-color: white
              color: black

        .no-blocked
          text-align: center
          color: #888
          padding: 2rem 0
          font-style: italic

        .blocked-list
          display: flex
          flex-direction: column
          gap: 0.5rem

        .blocked-user-item
          display: flex
          justify-content: space-between
          align-items: center
          padding: 0.75rem 1rem
          margin: 0.5rem 0
          background-color: #222
          border: 1px solid #333
          border-radius: 8px
          transition: background-color 0.2s

          &:hover
            background-color: #2a2a2a

          .username
            color: #fff
            font-weight: 500
            font-size: 0.95rem

          .unblock-btn
            border: 1px solid #ea4335
            color: #ea4335
            background-color: transparent
            padding: 4px 10px
            border-radius: 4px
            cursor: pointer
            font-size: 0.85rem
            transition: all 0.2s ease

            &:hover
              background-color: #ea4335
              color: white
              box-shadow: 0 0 10px rgba(234, 67, 53, 0.4)

      .active
        display: block

  .close
    position: absolute
    top: 15px
    right: 20px
    color: #888
    cursor: pointer
    width: 30px
    height: 30px
    display: flex
    align-items: center
    justify-content: center
    border-radius: 6px
    transition: all 0.2s ease

    @include hover()
      background-color: #333
      color: #fff

    :global(svg)
      width: 16px
      height: 16px

  .head
    grid-row: head
    display: flex
    align-items: center
    justify-content: center
    background-color: #222
    color: #fff
    font-size: 18px
    font-weight: 600
    border-bottom: 1px solid #333
    position: relative
    align-self: stretch

    :global(svg)
      margin-right: 10px
      width: 20px
      height: 20px

  @media (max-width: 900px)
    width: 90vw
    max-width: 700px

  @media (max-width: 600px)
    width: 95vw
    height: 80vh
    max-width: none

  @media (max-width: 800px)

    .contents
      grid-template-rows: 3rem auto
      grid-template-columns: unset

      .nav
        // flow items to the right
        grid-auto-flow: column
        grid-auto-rows: unset
        grid-auto-columns: max-content

      .options
        border-left-width: 0px
        border-top: 1px solid white

        .option
          padding: 0

.tooltip
  position: relative
  z-index: 2
  cursor: pointer

.ttbefore
  position: absolute
  bottom: 120%
  left: 50%
  margin-bottom: 5px
  margin-left: -30px
  padding: 5px 4px
  width: max-content
  border-radius: 3px
  background-color: black
  color: #fff

  background-color: rgba(white, 90%)
  color: black

  content: attr(data-tooltip)
  text-align: center
  font-size: 0.8rem
  line-height: 1.2

.ttafter
  position: absolute
  bottom: 120%
  left: 50%
  margin-left: -5px
  width: 0
  border-top: 5px solid rgba(white, 90%)
  border-right: 5px solid transparent
  border-left: 5px solid transparent
  content: " "
  font-size: 0
  line-height: 0

.tooltip
  &:before, &:after
    visibility: hidden
    opacity: 0
    pointer-events: none

  &:before
    @extend .ttbefore

  &.bottom:before
    @extend .ttbefore
    bottom: -170%

  &:after
    @extend .ttafter

  &.bottom:after
    @extend .ttafter
    bottom: -40%
    border-bottom: 5px solid rgba(white, 90%)
    border-top: 5px solid transparent

  &:hover
    &:before, &:after
      visibility: visible
      opacity: 1

.multireddit-popup
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.9)
  z-index: 10000
  display: none
  align-items: center
  justify-content: center

  &.show
    display: flex

  .popup-content
    background-color: #222
    padding: 2rem
    border-radius: 8px
    width: 80%
    max-width: 500px
    display: flex
    flex-direction: column
    gap: 1rem
    color: white
    box-shadow: 0 10px 25px rgba(0,0,0,0.5)

    h3
      margin: 0
      font-size: 1.2rem
      color: $yellow

    p
      margin: 0
      color: #ccc
      font-size: 0.9rem

    textarea
      width: 100%
      height: 100px
      background-color: #333
      color: white
      border: 1px solid #444
      padding: 0.5rem
      border-radius: 4px
      resize: vertical
      font-family: inherit
      box-sizing: border-box

      &:focus
        outline: none
        border-color: $yellow

    .buttons
      display: flex
      gap: 1rem
      justify-content: flex-end

      .button
        background-color: #444
        padding: 0.5rem 1rem
        border-radius: 4px
        cursor: pointer
        border: 1px solid transparent
        transition: all 0.2s
        color: white

        &:hover
          background-color: #555
          color: white
          border-color: white

</style>
