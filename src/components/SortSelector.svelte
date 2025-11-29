<script>
  import { goto } from "@sapper/app";
  import Icon from "fa-svelte/src/Icon.svelte";
  import { faSortAmountDown } from "@fortawesome/free-solid-svg-icons/faSortAmountDown";
  import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
  import { onMount } from "svelte";

  export let slugstr = "";
  export let params = {};

  let showSortOptions = false;
  let showTimeOptions = false;

  let currentSort = "hot";
  let currentTime = "all";

  const sortOptions = [
    { value: "hot", label: "Hot" },
    { value: "new", label: "New" },
    { value: "rising", label: "Rising" },
    { value: "controversial", label: "Controversial" },
    { value: "top", label: "Top" },
  ];

  const timeOptions = [
    { value: "hour", label: "Now" },
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "year", label: "This Year" },
    { value: "all", label: "All Time" },
  ];

  $: {
    // Parse current sort from slugstr
    // slugstr format: r/subreddit/sort or r/subreddit
    if (slugstr) {
      const parts = slugstr.split("/");
      // parts[0] is 'r' or 'user'
      // parts[1] is subreddit or username
      // parts[2] might be sort or 'm' (for multireddit)
      
      // Simple heuristic: check if the last part is a known sort
      const lastPart = parts[parts.length - 1];
      if (sortOptions.some(o => o.value === lastPart)) {
        currentSort = lastPart;
      } else {
        currentSort = "hot"; // Default
      }
    }

    // Parse time from params
    if (params && params.t) {
      currentTime = params.t;
    } else {
      currentTime = "all";
    }
  }

  function toggleSortOptions() {
    showSortOptions = !showSortOptions;
    showTimeOptions = false;
  }

  function toggleTimeOptions() {
    showTimeOptions = !showTimeOptions;
    showSortOptions = false;
  }

  function handleSortChange(sort) {
    showSortOptions = false;
    if (sort === currentSort && sort !== 'top' && sort !== 'controversial') return;

    // Construct new URL
    // We need to replace the sort part of the slugstr or append it
    let newSlug = slugstr;
    
    // Remove existing sort suffix if present
    for (const option of sortOptions) {
        if (newSlug.endsWith(`/${option.value}`)) {
            newSlug = newSlug.substring(0, newSlug.lastIndexOf(`/${option.value}`));
            break;
        }
    }

    // Append new sort (except for hot which is default, but explicit is okay too, let's be explicit if user selected it)
    // Actually, reddit treats /r/funny and /r/funny/hot same, but let's append to be clear
    if (sort !== 'hot') {
        newSlug = `${newSlug}/${sort}`;
    }

    // Keep query params? Usually we want to reset them unless it's 'top'/'controversial' needing 't'
    let query = "";
    if (sort === 'top' || sort === 'controversial') {
        // If switching to top/controversial, default to 'all' or keep current if already set?
        // Let's default to 'all' if not set, or keep current if we are just switching sort type but maybe that's confusing.
        // Let's start with default 'all' for simplicity, or 'day' which is often default. Reddit default is 'day' usually for top?
        // Actually let's check if we already have a time param, if so keep it, else default to all.
        query = `?t=${currentTime}`;
    }

    goto(`/${newSlug}${query}`);
  }

  function handleTimeChange(time) {
    showTimeOptions = false;
    if (time === currentTime) return;

    // We assume we are already in a sort mode that supports time (top/controversial)
    // So just update the query param
    const url = new URL(window.location.href);
    url.searchParams.set("t", time);
    goto(url.pathname + url.search);
  }

  function closeDropdowns() {
    showSortOptions = false;
    showTimeOptions = false;
  }
</script>

<svelte:window on:click={closeDropdowns} />

<div class="sort-selector" on:click|stopPropagation>
  <div class="btn-group">
    <span class="btn sort-btn tooltip bottom" data-tooltip="Sort: {currentSort}" on:click={toggleSortOptions}>
      <Icon icon={faSortAmountDown} />
    </span>
    
    {#if currentSort === 'top' || currentSort === 'controversial'}
      <span class="btn time-btn tooltip bottom" data-tooltip="Time: {currentTime}" on:click={toggleTimeOptions}>
        <Icon icon={faClock} />
      </span>
    {/if}
  </div>

  {#if showSortOptions}
    <div class="dropdown sort-dropdown">
      {#each sortOptions as option}
        <div 
          class="dropdown-item" 
          class:active={currentSort === option.value}
          on:click={() => handleSortChange(option.value)}
        >
          {option.label}
        </div>
      {/each}
    </div>
  {/if}

  {#if showTimeOptions}
    <div class="dropdown time-dropdown">
      {#each timeOptions as option}
        <div 
          class="dropdown-item" 
          class:active={currentTime === option.value}
          on:click={() => handleTimeChange(option.value)}
        >
          {option.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style lang="sass">
  @mixin hover()
    @media not all and (pointer:coarse)
      &:hover
        @content

  $text-color: #fafafa
  $accent-color: white
  $bg-color: rgba(26, 26, 26, 0.95)
  $hover-bg: rgba(255, 255, 255, 0.1)

  .sort-selector
    position: relative
    display: inline-block
    margin-left: 10px

    .btn-group
      display: flex
      gap: 5px

    .btn
      cursor: pointer
      font-size: 1.2rem
      color: white
      background-color: $bg-color
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

      @include hover()
        background-color: rgba(34, 34, 34, 0.95)
        transform: scale(1.05)

    .dropdown
      position: absolute
      top: 100%
      right: 0
      margin-top: 10px
      background-color: $bg-color
      backdrop-filter: blur(20px)
      border-radius: 8px
      padding: 5px 0
      min-width: 150px
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5)
      z-index: 100
      overflow: hidden

      .dropdown-item
        padding: 10px 20px
        color: rgba(white, 0.8)
        cursor: pointer
        transition: background-color 0.2s
        font-size: 0.9rem
        text-align: left

        &:hover
          background-color: $hover-bg
          color: white

        &.active
          color: #f9ab00
          font-weight: bold
</style>
