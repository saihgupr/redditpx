import fetchJsonp from "fetch-jsonp";
import {
  Dims,
  Img,
  FormattedItem,
  FormattedItemA,
  Orientation,
  RedditItem,
  Vid,
  Query,
  RedditItemData,
  Album,
  RedgifsResponse,
} from "./_types";

export function queryp(query: Query) {
  return Object.entries(query).map(([key, val]) => `${key}=${val}`).join("&");
}

export async function get_posts(url: string) {
  if (url.includes(' ')) {
    url = encodeURI(url);
  }
  console.log('get_posts url: ', url);
  try {
    if (url.includes('/r/home.') || url.includes('/r/home2.')) {
      let favorites: FormattedItemA[] = Object.values(JSON.parse(localStorage.getItem("favorite")));
      if (!url.includes('/r/home2.')) {
        favorites = favorites.filter((item) => true === item.favorite);
      } else {
        favorites = favorites.filter((item) => false === item.favorite);
      }
      favorites.reverse();

      return {
        posts: favorites,
        subreddit: 'Home',
        after: '',
        res: { ok: true, res: { ok: true } },
      };
    }

    let res = await fetchJsonp(url, { jsonpCallback: "jsonp", timeout: 10000 });
    let data = await res.json();
    console.log("Fetched: ", data.data.children.length, data.data);

    let subreddit: string = data.data.children[0].data.subreddit;

    let filtered: RedditItem[] = data.data.children.filter(
      (item: RedditItem) => filter(item),
    );

    // Debug line
    //filtered = filtered.slice(3, 4);

    console.log("Filtered: ", filtered.length, filtered);

    let formatted: FormattedItem[] = await Promise.all(
      filtered.map((post) => format(post)),
    );

    console.log("Formatted: ", formatted.length, formatted);
    let posts: FormattedItem[] = formatted.filter(
      (v, i, a) =>
        a.findIndex((t) => t.url == v.url) === i &&
        // Negate .. something that is_video but have 0 vid preview data
        !(v.is_video && Object.keys(v.preview.vid).length == 0),
    );

    console.log("Deduped+Live: ", posts.length, posts);

    return {
      posts,
      subreddit,
      after: data.data.after,
      res: { ok: true, res: res },
    };
  } catch (error) {
    console.log("[get_posts]: error");
    console.log(error);
    return {
      posts: [],
      after: "",
      subreddit: "",
      res: { ok: false, res: error },
    };
  }
}

function is_album(imgs: Img) {
  return imgs.hasOwnProperty("album");
}

function is_image(item: RedditItem) {
  return (
    url(item).endsWith(".jpg") ||
    url(item).endsWith(".jpeg") ||
    url(item).endsWith(".png") ||
    url(item).includes("imgur.com/a/") ||
    url(item).includes("reddit.com/gallery/") ||
    url(item).includes('media.gettyimages.com/photos/-id')
  );
}

function is_post(item: RedditItem) {
  // t3
  // t1 = to support /u/jeffjose
  return item.kind == "t3" || item.kind == "t1";
}

export function filter(item: RedditItem): boolean {
  return is_post(item) && (is_image(item) || is_video(item));
}

export function is_video(item: RedditItem) {
  if (!item.data.hasOwnProperty("preview")) {
    return false;
  }
  return (
    item.data.is_video ||
    item.data.preview.hasOwnProperty("reddit_video_preview") ||
    (url(item).startsWith("https://i.redd.it") && url(item).endsWith(".gif")) ||
    url(item).startsWith("https://gfycat.com/")
  );
}

export function get_dims(item: RedditItem) {
  let dims: Dims = { height: 0, width: 0 };

  if (is_image(item)) {
    try {
      dims =
      {
        height: item.data.preview.images[0].source.height,
        width: item.data.preview.images[0].source.width,
      };
    } catch {
      console.info(`No dims for ${url(item)}`, item);
    }
  } else if (is_video(item)) {
    try {
      dims =
      {
        height: item.data.preview.reddit_video_preview.height,
        width: item.data.preview.reddit_video_preview.width,
      };
    } catch {
      // if you cant get the dims from the video, pick it up from the preview image
      dims =
      {
        height: item.data.preview.images[0].source.height,
        width: item.data.preview.images[0].source.width,
      };
    }
  }

  return dims;
}

function extract_reddit_gallery(data: RedditItemData, imgs: Img) {
  let media_ids = data.gallery_data.items.map((x) => x.media_id);

  imgs["album"] = [];

  media_ids.forEach((id) => {
    let mi = data.media_metadata[id];

    let hires: string | undefined;
    try {
      hires = decode(mi.s.u);
    } catch {
      // TODO: Implement a proper fix, for now bail quickly
      return;
    }
    let i = {
      hires: hires,
      default: decode(mi.p[mi.p.length - 1].u),

      // TODO: assumption: reddit.com/gallery is always images
      is_image: true,
      is_video: false,

      // Needed for prefetch to work
      preview: {
        vid: { lores: decode(mi.p[mi.p.length - 1].u), mp4: hires },
        img: {
          hires: hires,
          default: decode(mi.p[mi.p.length - 1].u),
          album: [],
        },
      },
    };

    imgs["album"].push(i);
  });
}

async function imgsrc(u: string, item: RedditItem) {
  let imgs;
  try {
    imgs =
    {
      default: decode(
        item.data.preview.images[0].resolutions.slice(-1)[0].url,
      ),
      hires: decode(item.data.preview.images[0].source.url),
    };
  } catch {
    imgs = { default: url(item), hires: url(item) };
  }

  if (u.includes("reddit.com/gallery/")) {
    // This is an original post (and not a cross post)
    if (item.data.media_metadata) {
      extract_reddit_gallery(item.data, imgs);
    } else if (item.data.crosspost_parent_list?.length > 0) {
      // FIXME: Assume the first one is the only cross-post available.
      let origpost = item.data.crosspost_parent_list[0];

      extract_reddit_gallery(origpost, imgs);
    }
  }

  if (u.includes("imgur.com/a/")) {
    try {
      let res = await fetch(`${u}/embed`);
      let html = await res.text();
      let images = [];

      imgs["album"] = extractAlbumInfoNode(html);
    } catch (error) { }
  }

  //  if (u.includes("imgur.com/a/")) {
  //    //
  //    //
  //
  //    // Other cors proxies
  //    // https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
  //    //
  //    try {
  //      //let corsproxy = "https://cors-anywhere.herokuapp.com/";
  //      let corsproxy = "https://cors-anywhere.glitch.me/";
  //      let backupproxies = [
  //        "https://redditpx-cors-2.glitch.me/",
  //        "https://redditpx-cors.glitch.me/",
  //      ];
  //
  //      let res;
  //      try {
  //        res = await fetch(`${corsproxy}${u}/embed`, {
  //          headers: { origin: "redditpx" },
  //        });
  //      } catch (error) {
  //        corsproxy = backupproxies[randint(0, backupproxies.length - 1)];
  //
  //        res = await fetch(`${corsproxy}${u}/embed`, {
  //          headers: { origin: "redditpx" },
  //        });
  //      }
  //
  //      let html = await res.text();
  //      let images = [];
  //
  //      imgs["album"] = extractAlbumInfoNode(html);
  //    } catch (error) {}
  //  }
  return imgs;
}

function randint(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function extractAlbumInfoNode(html): Album[] {
  let parser = new DOMParser();
  let scripts = parser.parseFromString(html, "text/html").querySelectorAll(
    'script[type="text/javascript"]',
  );

  let node = Array.from(scripts).filter(
    (node) => node.outerHTML.includes("album.generalInit()"),
  )[0];

  // Extract JSON embedded inside js code
  //
  // 1. Remove extra spaces
  // 2. Remove newlines
  // 3. Grab everything inbetween `,album: and ,images:`
  // 4. Convert to JSON
  //
  let info = JSON.parse(
    node.outerHTML.replace(/ /g, "").replace(/\n/g, "").match(
      /,album:(.*),images:/,
    )[1],
  );

  let album: Album[] = [];
  for (const _i of info.album_images.images) {
    let lores = `https://i.imgur.com/${_i.hash}h${_i.ext}`.replace(
      ".gif",
      ".mp4",
    );
    let hires = `https://i.imgur.com/${_i.hash}${_i.ext}`.replace(
      ".gif",
      ".mp4",
    );
    let i = {
      // Force mp4 for imgur gifs
      hires: hires,
      default: lores,
      is_image: !_i.prefer_video,
      is_video: _i.prefer_video,

      // Needed for prefetch to work
      preview: {
        vid: { lores: lores, mp4: hires },
        img: { hires: hires, default: lores, album: [] },
      },
    };

    album.push(i);
  }
  return album;
}

async function vidsrc(url: string, item: RedditItem) {
  if (url.includes("imgur.com/")) {
    let name = url.match(/imgur.com\/(.*)\..*/)[1];
    return {
      gif: `https://i.imgur.com/${name}.gif`,
      //webm: `https://i.imgur.com/${name}.webm`,
      mp4: `https://i.imgur.com/${name}.mp4`,
      lores: `https://i.imgur.com/${name}.mp4`,
    };
  } else if (url.includes("gfycat.com/")) {
    let name = url.match(/gfycat.com\/(.*)/)[1];

    // Sometimes gfycat urls are of the format "gfycat.com/videoid-extra-stuff". Remove anything after the first "-"
    name = name.split("-")[0].replace(".gif", "");

    // Sometimes gfycat urls are of the format "gfycat.com/gifs/detail/videoid".
    name = name.replace("gifs/detail/", "");

    if (/[A-Z]/.test(name)) {
      // We get inside this if we already know the correct gfyName (small+caps) from api
      // and dont need to do another api call here in the frontend

      return {
        webm: `https://giant.gfycat.com/${name}.webm`,
        mp4: `https://giant.gfycat.com/${name}.mp4`,
        gif: `https://giant.gfycat.com/${name}-size_restricted.gif`,
        lores: `https://thumbs.gfycat.com/${name}-mobile.mp4`,
      };
    }

    let res = await fetch(
      `https://api.gfycat.com/v1/gfycats/${name}`,
      {
        //mode: "no-cors"
      },
    );

    if (res.status == 404) {

      return {
        mp4: item.data.preview.reddit_video_preview.fallback_url,
        lores: item.data.preview.reddit_video_preview.fallback_url,
      };

    }

    try {
      let data = await res.json();

      return {
        webm: data.gfyItem.webmUrl,
        mp4: data.gfyItem.mp4Url,
        gif: data.gfyItem.gifUrl,
        lores: data.gfyItem.mp4Url.replace("giant.", "thumbs.").replace(
          ".mp4",
          "-mobile.mp4",
        ),
      };
    } catch {
      // If gfycat.com fails, try redgifs.com
      // https://www.reddit.com/r/redditp/comments/gpwo5u/why_do_so_many_gifs_and_video_come_up_blank_black/

      return {
        mp4: item.data.preview.reddit_video_preview.fallback_url,
        lores: item.data.preview.reddit_video_preview.fallback_url,
      };

    }
  } else if (url.includes("redgifs.com/")) {

    return {
      mp4: item.data.preview.reddit_video_preview.fallback_url,
      lores: item.data.preview.reddit_video_preview.fallback_url,
    };


  } else if (url.includes("v.redd.it")) {
    return {
      mp4: item.data.media.reddit_video.fallback_url,
      lores: item.data.media.reddit_video.fallback_url,
      dashUrl: item.data.media.reddit_video.dash_url,
    };
  } else if (url.includes("reddit.com/r/")) {
    return {
      mp4: item.data.preview.reddit_video_preview.fallback_url,
      lores: item.data.preview.reddit_video_preview.fallback_url,
    };
  } else if (url.includes("i.redd.it/")) {
    let gif, mp4;
    try {
      gif =
        item.data.preview.images[0].variants.gif.resolutions.slice(-1)[0].url;
      mp4 =
        item.data.preview.images[0].variants.mp4.resolutions.slice(-1)[0].url;
    } catch (error) {
      gif = item.data.preview.images[0].variants.gif.source.url;
      mp4 = item.data.preview.images[0].variants.mp4.source.url;
    }

    return { gif: decode(gif), mp4: decode(mp4), lores: decode(mp4) };
  } else {
    return {
      mp4: item.data.preview.reddit_video_preview.fallback_url,
      lores: item.data.preview.reddit_video_preview.fallback_url,
    };
  }
}

function url(item: RedditItem): string {
  return item.data.url || item.data.link_url;
}

function decode(str: string): string | undefined {
  if (str === undefined) {
    return undefined;
  }
  let parser = new DOMParser();
  return (
    parser.parseFromString(`<!doctype html><body>${str}`, "text/html").body.textContent || undefined
  );
}

function title(item: RedditItem): string {

  return (
    decode(item.data.title) || decode(item.data.link_title) || "(no title)"
  );
}

function thumbnail(item: RedditItem) {
  let thumbnail = item.data.thumbnail;

  try {
    if (thumbnail == "spoiler" || thumbnail == "nsfw") {
      return decode(item.data.preview.images[0].resolutions[0].url);
    } else if (thumbnail == "default" && item.data.is_gallery == true) {
      /* @ts-ignore */
      return decode(Object.values(item.data.media_metadata)[0].p[0].u);
    } else {
      return item.data.thumbnail;
    }
  } catch (e) {
    return item.data.thumbnail;
  }
}

export async function format(item: RedditItem): Promise<FormattedItem> {
  if (Object.entries(item).length == 0) {
    return {
      title: "Loading ..",
      url: undefined,

      // These 2 are needed for filtering out dead items
      // It is normally the video that goes dead, hence video related fields
      preview: {},
      is_video: false,
    };
  }

  let imgs: Img = await imgsrc(url(item), item);

  // vidsrc does caching of api response, so make it one of the first items in this fuction
  let vids: Vid = {};
  if (is_video(item)) {
    try { vids = await vidsrc(url(item), item); } catch { }
  }

  let dims: Dims = get_dims(item);

  let orientation: Orientation = Orientation.Normal;
  if ((dims.width / dims.height) <= 0.7) {
    orientation = Orientation.Portrait;
  } else if ((dims.width / dims.height) >= 1.7) {
    orientation = Orientation.Landscape;
  }
  let t = thumbnail(item);

  let formatted: FormattedItem = {
    id: item.data.id,
    author: item.data.author,
    authorp: `u/${item.data.author}`,
    title: title(item),
    thumbnail: t,
    subreddit: item.data.subreddit,
    subredditp: item.data.subreddit_name_prefixed,
    permalink: item.data.permalink,
    over18: item.data.over_18,
    is_video: is_video(item),
    is_image: is_image(item),
    is_album: is_album(imgs), // based on `imgs`
    favorite: false,
    url: url(item),
    dims: dims,
    orientation: orientation,
    preview: { vid: vids, img: imgs },
  };

  return formatted;
}
