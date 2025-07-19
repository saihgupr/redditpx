import type { VercelRequest, VercelResponse } from '@vercel/node';

import fetch from 'node-fetch';
import jsdom from 'jsdom';

const CLIENT_ID = '546c25a59c58ad7'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {

  if (request.query.gallery !== undefined) {
    await fetch_and_respond_gallery(request, response)
  }
  else if (request.query.album !== undefined) {
    await fetch_and_respond_album(request, response)
  }
}

async function fetch_and_respond_gallery(request: VercelRequest, response: VercelResponse) {

  const items = []
  const galleryid = request.query.gallery
  const cursor = 'cursor'
  const userid = 'imguruser'

  const options = {
    runScripts: 'dangerously'
  }
  const r = await fetch(`https://imgur.com/gallery/${galleryid}`)
  const text = await r.text()
  const dom = new jsdom.JSDOM(text, options)

  const data = JSON.parse(dom.window.postDataJSON)
  const urls = data.media.map((x) => x.url)
  data.media.forEach((x, i) => {
    // Update the item's title with the gallery title
    x.title = data.media.length > 1 ? `${data.title} (${i + 1})` : data.title

    x.thumbnail = `https://i.imgur.com/${x.id}m.jpg`
  })

  if (request.query.jsonp) {
    response.status(200).send(
      request.query.jsonp + '(' + JSON.stringify(mkresponse(urls, data.media, userid, cursor)) + ')'
    )
    return
  }
  response.status(200).json(mkresponse(urls, data.media, userid, cursor))

}

async function fetch_and_respond_album(request: VercelRequest, response: VercelResponse) {

  const albumid = request.query.album
  const cursor = 'cursor'
  const userid = 'imguruser'

  const r = await fetch(`https://api.imgur.com/post/v1/albums/${albumid}?client_id=${CLIENT_ID}&include=media`)
  const json: any = await r.json()

  const urls = json.media.map((x) => x.url)
  json.media.forEach((x, i) => {
    // Update the item's title with the gallery title
    x.title = json.media.length > 1 ? `${json.title} (${i + 1})` : json.title

    x.thumbnail = `https://i.imgur.com/${x.id}m.jpg`
  })

  if (request.query.jsonp) {
    response.status(200).send(
      request.query.jsonp + '(' + JSON.stringify(mkresponse(urls, json.media, userid, cursor)) + ')'
    )
    return
  }
  response.status(200).json(mkresponse(urls, json.media, userid, cursor))

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
      "subreddit": "imgur",
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
      "thumbnail": item.thumbnail,
      "thumbnail_height": 140,
      "top_awarded_type": null,
      "hide_score": false,
      "name": "imgurname",
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
      "edited": false,
      "gildings": {},
      "content_categories": null,
      "is_self": false,
      "mod_note": null,
      "created": 1677277233.0,
      "link_flair_type": "text",
      "wls": 0,
      "removed_by_category": null,
      "banned_by": null,
      "author_flair_type": "richtext",
      "domain": "imgur.com",
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
              "url": url,
              "width": item.width,
              "height": item.height,
            },
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
      "author_flair_text": "Imgur author flair text",
      "treatment_tags": [],
      "visited": false,
      "removed_by": null,
      "num_reports": null,
      "distinguished": null,
      "subreddit_id": "imgur",
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
      "permalink": "imgur.com",
      "parent_whitelist_status": "no_ads",
      "stickied": false,
      "url": url,
      "subreddit_subscribers": 325880,
      "created_utc": 1677277233.0,
      "num_crossposts": 1,
      "is_video": item.metadata.is_animated
    }
  }

}
