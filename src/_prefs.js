import { writable } from "svelte/store";

const store = (key, initialValue) => {
  const { subscribe, set } = writable(initialValue);

  return {
    subscribe,
    set,
    useLocalStorage: (defaultValue) => {
      if (!process.browser) {
        return;
      }

      let json;
      try {
        json = localStorage.getItem(key);
      } catch (e) {
        console.log(e);
      }

      if (json) {
        set(JSON.parse(json));
      } else {
        set(defaultValue);
      }

      subscribe((current) => {
        try {
          localStorage.setItem(key, JSON.stringify(current));
        } catch (e) {
          console.log(e);
          return;
        }
      });
    },
  };
};

export const autoplay = store("autoplay");
export const autoplayinterval = store("autoplayinterval");
export const scrollspeed = store("scrollspeed");
export const imageVideo = store("imageVideo");
export const portraitLandscape = store("portraitLandscape");
export const favorite = store("favorite");
export const over18 = store("over18");
export const multireddit = store("multireddit");
export const prefetch = store("prefetch");
export const prefetchNum = store("prefetchNum");
export const numCols = store("numCols");
export const hires = store("hires");
export const lores = store("lores");
export const oldreddit = store("oldreddit");
export const muted = store("muted");
export const layout = store("layout");
