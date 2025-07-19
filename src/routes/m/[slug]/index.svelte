<script context="module">
  export async function preload({ path, params, query }) {
    if (typeof window === "undefined") return;

    let slugstr = path.substring(1).replace(/\/$/, "").replace(/%20/g, ""); // remove the leading and trailing slash, and %20 (spaces)
    fetch("https://redditpx.jeffjose.cloud/" + slugstr).catch((e) => e);
    console.log(slugstr);

    let _slugstrL, slugstrL;
    let _slugstrR, slugstrR;

    [_slugstrL, _slugstrR] = slugstr
      .replace(/m\//, "")
      .replaceAll(encodeURIComponent("/search?"), "/search.json?")
      .split("+");

    slugstrL = `r/${decodeURIComponent(_slugstrL)}`;
    slugstrR = `r/${decodeURIComponent(_slugstrR)}`;
    console.log(slugstrL);
    console.log(slugstrR);

    let {
      posts: postsL,
      res: resL,
      after: afterL
    } = await get_posts(`https://reddit.com/${slugstrL}.json?${queryp(query)}`);

    let {
      posts: postsR,
      res: resR,
      after: afterR
    } = await get_posts(`https://reddit.com/${slugstrR}.json?${queryp(query)}`);

    return { postsL, afterL, resL, slugstrL, postsR, afterR, resR, slugstrR };
  }
</script>

<script>
  import { get_posts, queryp } from "../../../_utils.ts";

  import { stores } from "@sapper/app";
  const { page } = stores();

  import { favorite, layout } from "../../../_prefs";
  favorite.useLocalStorage({});
  layout.useLocalStorage(0);
</script>

<template lang="pug">
</template>

<style>
</style>
