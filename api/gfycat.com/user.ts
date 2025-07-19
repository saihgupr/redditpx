import type { VercelRequest, VercelResponse } from '@vercel/node';

import fetch from 'node-fetch';

let COUNT = 500

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {

  const userid = (request.query.user as string).replace(/@/, '')
  const collectionid = request.query.collection

  let gfycatapiurl

  if (collectionid !== 'undefined' && collectionid !== undefined) {
    gfycatapiurl = `https://api.gfycat.com/v1/users/${userid}/collections/${collectionid}/gfycats?count=${COUNT}&cursor=${decodeURIComponent(request.query.after as string ?? '')}`
  }
  else {
    gfycatapiurl = `https://api.gfycat.com/v1/users/${userid}/gfycats?count=${COUNT}&cursor=${decodeURIComponent(request.query.after as string ?? '')}`
  }

  await fetch_and_respond(request, response, gfycatapiurl, userid)
}

async function fetch_and_respond(request: VercelRequest, response: VercelResponse, gfycatapiurl: string, userid: string) {

  const r = await fetch(gfycatapiurl)
  const json: any = await r.json()

  const ids = json.gfycats.map((x) => x.gfyName) // Using gfyName instead of gfyId so that we can avoid an api call from the frontend
  const urls = ids.map((x) => `https://gfycat.com/${x}`)
  const items = json.gfycats

  const cursor = encodeURIComponent(json.cursor)

  if (request.query.jsonp) {
    response.status(200).send(
      request.query.jsonp + '(' + JSON.stringify(mkresponse(urls, items, userid, cursor)) + ')'
    )
    return
  }
  response.status(200).json(mkresponse(urls, items, userid, cursor))

}


function mkresponse(urls: string[], items: any[], userid: string, cursor: string) {

  return {
    kind: "Listing",
    data: {
      after: cursor,
      children: urls.map((x, i) => mkdataitem(x, items[i], userid))
    }
  }

}

function mkdataitem(url, item, userid) {

  return {
    kind: "t3",
    data: {
      "approved_at_utc": null,
      "subreddit": "gfycat",
      "selftext": "",
      "author_fullname": userid,
      "saved": false,
      "mod_reason_title": null,
      "gilded": 0,
      "clicked": false,
      "title": item.title,
      "link_flair_richtext": [],
      "subreddit_name_prefixed": `u/${userid}`,
      "hidden": false,
      "pwls": 0,
      "link_flair_css_class": null,
      "downs": 0,
      "thumbnail_height": 140,
      "top_awarded_type": null,
      "hide_score": false,
      "name": "gfycatname",
      "quarantine": false,
      "link_flair_text_color": "dark",
      "upvote_ratio": 0.98,
      "author_flair_background_color": null,
      "subreddit_type": "public",
      "ups": 1131,
      "total_awards_received": 0,
      "thumbnail_width": 140,
      "author_flair_template_id": "02666ee0-e0ea-11e4-9cf7-22000b280e28",
      "is_original_content": false,
      "user_reports": [],
      "is_reddit_media_domain": false,
      "is_meta": false,
      "category": null,
      "link_flair_text": null,
      "can_mod_post": false,
      "score": 1131,
      "approved_by": null,
      "is_created_from_ads_ui": false,
      "author_premium": true,
      "thumbnail": item.posterUrl,
      "edited": false,
      "gildings": {},
      "post_hint": "rich:video",
      "content_categories": null,
      "is_self": false,
      "mod_note": null,
      "created": 1677277233.0,
      "link_flair_type": "text",
      "wls": 0,
      "removed_by_category": null,
      "banned_by": null,
      "author_flair_type": "richtext",
      "domain": "gfycat.com",
      "allow_live_comments": false,
      "selftext_html": null,
      "likes": null,
      "suggested_sort": null,
      "banned_at_utc": null,
      "url_overridden_by_dest": url,
      "view_count": null,
      "archived": false,
      "no_follow": false,
      "is_crosspostable": false,
      "pinned": false,
      "over_18": true,
      "preview": {
        "images": [
          {
            "source": {
              "url": item.posterUrl,
              "width": item.width,
              "height": item.height,
            },
            "resolutions":
              [
                {
                  "url": item.posterUrl,
                  "width": item.width,
                  "height": item.height
                }
              ],
            "id": "548lbOuX-C9g1j7YAbF4UdfCYsUick-Sa_79SswedVE"
          }
        ],
        "enabled": false
      },
      "all_awardings": [],
      "awarders": [],
      "media_only": false,
      "can_gild": false,
      "spoiler": false,
      "locked": false,
      "author_flair_text": "Gfycat author flair text",
      "treatment_tags": [],
      "visited": false,
      "removed_by": null,
      "num_reports": null,
      "distinguished": null,
      "subreddit_id": "gfycat",
      "author_is_blocked": false,
      "mod_reason_by": null,
      "removal_reason": null,
      "link_flair_background_color": "",
      "id": url,
      "is_robot_indexable": true,
      "report_reasons": null,
      "author": userid,
      "discussion_type": null,
      "num_comments": 42,
      "send_replies": true,
      "whitelist_status": "no_ads",
      "contest_mode": false,
      "mod_reports": [],
      "author_patreon_flair": false,
      "author_flair_text_color": "dark",
      "permalink": "gfycat.com",
      "parent_whitelist_status": "no_ads",
      "stickied": false,
      "url": url,
      "subreddit_subscribers": 325880,
      "created_utc": 1677277233.0,
      "num_crossposts": 1,
      "is_video": false
    }
  }

}
