import { createAlova } from "alova";
import adapterFetch from "alova/fetch";

export const alovaInstance = createAlova({
  requestAdapter: adapterFetch(),
  responded: (response) => response.json(),
  baseURL: "https://pokeapi.co/api/v2",
  cacheFor: {
    GET: {
      mode: "restore",
      expire: () => 24 * 60 * 60, //1 day
    },
  },
});
