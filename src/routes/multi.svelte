<script>
  import { goto as ahref } from "@sapper/app";

  import { multireddit } from "../_prefs";
  multireddit.useLocalStorage({});

  let mreddits = [];
  let slideshowurl;

  $: {
    mreddits = $multireddit ? Object.entries($multireddit) : [];

    slideshowurl = $multireddit
      ? `/r/${Object.keys($multireddit).join("+")}`
      : "";

    if (typeof window !== "undefined" && slideshowurl) {
      console.log(slideshowurl);
      ahref(slideshowurl, { replaceState: false });
    }
  }
</script>
