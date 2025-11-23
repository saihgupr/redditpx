<script context="module">
  export async function preload({ path, params, query }) {
    if (typeof window === "undefined") return;

    let slugstr = path.substring(1).replace(/\/$/, "").replace(/%20/g, "+"); // remove the leading and trailing slash, and convert %20 to + for subreddit combinations
    fetch("https://redditpx.jeffjose.cloud/" + slugstr).catch((e) => e);

    // If the user has r/user/username, they probably wanted
    // /user/username

    // The case of r/user/username/m/multi is handled inside _error.svelte
    if (slugstr.startsWith("r/user/") || slugstr.startsWith("r/u/")) {
      let newPath = slugstr.replace("r/", "");
      this.redirect(302, newPath);
    }

    let { posts, res, after } = await get_posts(
      `https://reddit.com/${slugstr}.json?${queryp(query)}`
    );

    return { posts, after, res, slugstr };
  }
</script>

<script>
  import FullscreenLayout from "../../../components/FullscreenLayout.svelte";

  import { get_posts, queryp } from "../../../_utils.ts";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import { favorite, layout } from "../../../_prefs";
  favorite.useLocalStorage({});
  layout.useLocalStorage(0);

  export let posts = [];
  export let res;
  export let after;
  export let slugstr;

  // Load `favorite` from localstorage
  for (let p of posts) {
    p["favorite"] = !!($favorite[p.url]?.favorite);
  }
</script>

<template lang="pug">
  +if('$layout == 0')
    FullscreenLayout({slugstr}, {posts}, {res}, {after}, params ='{$page.query}')
</template>
