/* Reddit Response */

interface MediaEmbed { }

interface RedditVideo {
  bitrate_kbps: number,
  fallback_url: string,
  height: number,
  width: number,
  scrubber_media_url: string,
  dash_url: string,
  duration: number,
  hls_url: string,
  is_gif: boolean,
  transcoding_status: string,
}

interface SecureMedia { reddit_video: RedditVideo, oembed: any }

interface SecureMediaEmbed { }

interface Gildings { gid_1: number }

interface Source { url: string, width: number, height: number }

interface Resolution { url: string, width: number, height: number }

interface Variants { mp4: VariantItem, gif: VariantItem }

interface VariantItem {
  resolutions: VariantItemData[],
  source: VariantItemData,
}

interface VariantItemData { url: string }

interface Image {
  source: Source,
  resolutions: Resolution[],
  variants: Variants,
  id: string,
}

interface RedditPreview {
  images: Image[],
  reddit_video_preview: VideoPreview,
  enabled: boolean,
}

export interface VideoPreview {
  bitrate_kbps: number,
  fallback_url: string,
  height: number,
  width: number,
  scrubber_media_url: string,
  dash_url: string,
  duration: number,
  hls_url: string,
  is_gif: boolean,
  transcoding_status: string,
}

interface ResizedIcon { url: string, width: number, height: number }

interface ResizedStaticIcon { url: string, width: number, height: number }

interface AllAwarding {
  giver_coin_reward?: any,
  subreddit_id?: any,
  is_new: boolean,
  days_of_drip_extension: number,
  coin_price: number,
  id: string,
  penny_donate?: any,
  award_sub_type: string,
  coin_reward: number,
  icon_url: string,
  days_of_premium: number,
  tiers_by_required_awardings?: any,
  resized_icons: ResizedIcon[],
  icon_width: number,
  static_icon_width: number,
  start_date?: any,
  is_enabled: boolean,
  awardings_required_to_grant_benefits?: any,
  description: string,
  end_date?: any,
  subreddit_coin_reward: number,
  count: number,
  static_icon_height: number,
  name: string,
  resized_static_icons: ResizedStaticIcon[],
  icon_format?: any,
  icon_height: number,
  penny_price?: any,
  award_type: string,
  static_icon_url: string,
}

export interface RedditItemData {
  approved_at_utc?: any,
  subreddit: string,
  selftext: string,
  author_fullname: string,
  saved: boolean,
  mod_reason_title?: any,
  gilded: number,
  clicked: boolean,
  link_flair_richtext: any[],
  subreddit_name_prefixed: string,
  hidden: boolean,
  pwls: number,
  link_flair_css_class: string,
  downs: number,
  thumbnail_height: number,
  top_awarded_type?: any,
  hide_score: boolean,
  name: string,
  quarantine: boolean,
  link_flair_text_color: string,
  upvote_ratio: number,
  author_flair_background_color?: any,
  ups: number,
  total_awards_received: number,
  media_embed: MediaEmbed,
  thumbnail_width: number,
  author_flair_template_id?: any,
  is_original_content: boolean,
  user_reports: any[],
  secure_media: SecureMedia,
  is_reddit_media_domain: boolean,
  is_meta: boolean,
  is_gallery: boolean,
  category?: any,
  secure_media_embed: SecureMediaEmbed,
  link_flair_text: string,
  can_mod_post: boolean,
  score: number,
  approved_by?: any,
  is_created_from_ads_ui: boolean,
  author_premium: boolean,
  thumbnail: string,
  edited: boolean,
  author_flair_css_class?: any,
  author_flair_richtext: any[],
  gildings: Gildings,
  post_hint: string,
  content_categories?: any,
  is_self: boolean,
  subreddit_type: string,
  created: number,
  link_flair_type: string,
  wls: number,
  removed_by_category?: any,
  banned_by?: any,
  author_flair_type: string,
  domain: string,
  allow_live_comments: boolean,
  selftext_html?: any,
  likes?: any,
  suggested_sort?: any,
  banned_at_utc?: any,
  url_overridden_by_dest: string,
  view_count?: any,
  archived: boolean,
  no_follow: boolean,
  is_crosspostable: boolean,
  pinned: boolean,
  over_18: boolean,
  preview: RedditPreview,
  all_awardings: AllAwarding[],
  awarders: any[],
  media_only: boolean,
  link_flair_template_id: string,
  can_gild: boolean,
  spoiler: boolean,
  locked: boolean,
  author_flair_text?: any,
  treatment_tags: any[],
  visited: boolean,
  removed_by?: any,
  mod_note?: any,
  distinguished?: any,
  subreddit_id: string,
  author_is_blocked: boolean,
  mod_reason_by?: any,
  num_reports?: any,
  removal_reason?: any,
  link_flair_background_color: string,
  id: string,
  is_robot_indexable: boolean,
  report_reasons?: any,
  author: string,
  discussion_type?: any,
  num_comments: number,
  send_replies: boolean,
  whitelist_status: string,
  contest_mode: boolean,
  mod_reports: any[],
  author_patreon_flair: boolean,
  author_flair_text_color?: any,
  permalink: string,
  parent_whitelist_status: string,
  stickied: boolean,
  url: string, // TODO: deprecate this at some point
  link_url: string, // this is the replacement for `url`, it seems like
  title: string, // TODO: deprecate this at some point
  link_title: string, // This is the replacement for `title`
  subreddit_subscribers: number,
  created_utc: number,
  num_crossposts: number,
  media: SecureMedia,
  is_video: boolean,
  media_metadata: RedditMediaMetadata,
  gallery_data: GalleryData,
  crosspost_parent_list: RedditItemData[],
}

export interface RedditMediaMetadata { [key: string]: MediaMetadataItem }

export interface MediaMetadataItem {
  status: string,
  e: string,
  m: string,
  p: P[],
  s: S,
  id: string,
}
export interface S { y: number, x: number, j, u: string }

export interface P { y: number, x: number, u: string }

export interface GalleryData { items: GalleryDataItem[] }
export interface GalleryDataItem {
  caption: string,
  media_id: string,
  id: number,
}

export interface RedditItem { kind: string, data: RedditItemData }

export interface LinkFlairRichtext { e: string, t: string }

export interface AuthorFlairRichtext { e: string, t: string }

export interface Preview { images: Image[], enabled: boolean }

/* Formatted */

export interface Dims { height: number, width: number }

export type Vid =
  | {
    // imgur.com
    gif: string,
    mp4: string,
    lores: string,
  }
  | {
    // redgifs.com / gfycat.com
    gif: string,
    mp4: string,
    webm: string,
    lores: string,
  }
  | {
    // v.redd.it, reddit.com/r/
    mp4: string,
    lores: string,
  }
  | {
    // i.reddit.com
    gif: string,
    mp4: string,
    lores: string,
  }
  | {
    // default
    mp4: string,
    lores: string,
  }
  | {};

export interface Img { default: string, hires: string, album: Album[] }

export interface Album {
  default: string | undefined,
  hires: string | undefined,
  is_image: boolean,
  is_video: boolean,
  preview: FormattedItemPreview,
}

export interface FormattedItemPreview { vid?: Vid, img?: Img }

export type FormattedItemA =
{
  id: string,
  author: string,
  authorp: string,
  title: string,
  thumbnail: string,
  subreddit: string,
  subredditp: string,
  permalink: string,
  over18: boolean,
  is_video: boolean,
  is_image: boolean,
  is_album: boolean,
  favorite: boolean,
  url: string,
  dims: Dims,
  orientation: Orientation,
  preview: FormattedItemPreview,
};

export type FormattedItemB =
{
  url: undefined,
  title: string,
  preview: FormattedItemPreview,
  is_video: boolean,
};

export type FormattedItem = FormattedItemA | FormattedItemB;

export enum Orientation {
  Normal = "normal",
  Portrait = "portrait",
  Landscape = "landscape",
}

/* Sapper */
import type fetchType from "node-fetch";
export type FetchResponse = Response | ReturnType<typeof fetchType>;

export interface PreloadContext {
  fetch: (url: string, options?: any) => Promise<FetchResponse>,
  error: (statusCode: number, message: Error | string) => void,
  redirect: (statusCode: number, location: string) => void,
}

export type PageParams = Record<string, string>;
export type Query = Record<string, string | string[]>;

export interface PageContext {
  host: string,
  path: string,
  params: PageParams,
  query: Query,
  /** `error` is only set when the error page is being rendered. */
  error?: Error,
}

/**
 * @deprecated PageContext is the preferred name. Page might be removed in the future.
 */
export { PageContext as Page };

export type PreloadResult = object | Promise<object>;
export interface Preload {
  (this: PreloadContext, page: PageContext, session: any): PreloadResult,
}
export interface Redirect { statusCode: number, location: string }

export interface DOMComponentModule {
  default: DOMComponentConstructor,
  preload?: Preload,
}

export interface DOMComponent {
  $set: (data: any) => void,
  $destroy: () => void,
}

export interface DOMComponentConstructor {
  new(options: { target: Element, props: unknown, hydrate: boolean }): DOMComponent,
}

export interface DOMComponentLoader { js: () => Promise<DOMComponentModule> }

export interface Route {
  pattern: RegExp,
  parts: Array<{ i: number, params?: (match: RegExpExecArray) => PageParams }>,
}

export interface HydratedTarget {
  redirect?: Redirect,
  preload_error?: any,
  props: any,
  branch: Branch,
}

export type Branch = Array<
  {
    segment: string,
    match?: RegExpExecArray,
    component?: DOMComponentConstructor,
    part?: number,
  }
>;

export type InitialData = {
  session: any,
  preloaded?: object[],
  status: number,
  error: Error,
  baseUrl: string,
};

export interface ScrollPosition { x: number, y: number }

export interface Target {
  href: string,
  route: Route,
  match: RegExpExecArray,
  page: PageContext,
}

export interface Redirect { statusCode: number, location: string }

/// redgifs response

export type Urls = {
  sd: string,
  hd: string,
  poster: string,
  thumbnail: string,
  vthumbnail: string,
};

export type Gif = {
  id: string,
  createDate: number,
  hasAudio: boolean,
  width: number,
  height: number,
  likes: number,
  tags: string[],
  verified: boolean,
  views: number,
  duration: number,
  published: boolean,
  urls: Urls,
  userName: string,
  type: number,
  avgColor: string,
  gallery?: any,
};

export type User = {
  creationtime: number,
  description?: any,
  followers: number,
  following: number,
  gifs: number,
  name?: any,
  profileImageUrl?: any,
  profileUrl: string,
  publishedCollections: number,
  publishedGifs: number,
  socialUrl1?: any,
  socialUrl2?: any,
  socialUrl3?: any,
  socialUrl4?: any,
  socialUrl5?: any,
  socialUrl6?: any,
  socialUrl7?: any,
  socialUrl8?: any,
  socialUrl9?: any,
  socialUrl10?: any,
  subscription: number,
  url: string,
  username: string,
  verified: boolean,
  views: number,
  poster: string,
  preview: string,
  thumbnail: string,
};

export type ErrorMessage = { code: string, description: string };
export type RedgifsResponse = {
  gif: Gif,
  user: User,
  errorMessage?: ErrorMessage,
};
