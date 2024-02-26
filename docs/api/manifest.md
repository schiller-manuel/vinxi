# Manifest API

One of the trickier parts of making a full stack app is getting all the pieces across different environments to work together. These environments need some crucial information about one another to coordinate their work. This is where manifests come in. A manifest is a data structure that tells the runtime about the current router and the other routers. It includes information produced by the bundler about what files are involved in each router along with all the other assets that are used. The runtime uses the manifest to know what files to serve and how to serve them.

The real tricky part is making it work the same during DEV and PROD.

- **Development**: the manifest is generated on the fly, vite-style.
- **Production**: the manifest is generated by the bundler and then saved to disk. The runtime then reads the manifest from disk.

The manifest API is also the same between the server and client, development and production.

You can access the manifest for any router by using calling `getManifest(routerName)` (exported by `vinxi/manifest`). This will give you a manifest object that looks like this:

```ts
export type Asset = string;

export type Manifest = {
  /** Name of the router */
  name: string;
  /** Handler path for the router */
  handler: string;
  base: string;
  routes(): Promise<
    {
      /** Route path */
      route: string;
      /** Path to built artifact for this route */
      path: string;
    }[]
  >;
  target: "browser" | "server" | "static";
  type: string;
  inputs: {
    [key: string]: {
      /** Assets needed by this entry point */
      assets(): Promise<Asset[]>;
      import<T = { default: any; [k: string]: any }>(): Promise<T>;
      output: {
        /** Path to built artifact for this entry point. */
        path: string;
      };
    };
  };
  chunks: {
    [key: string]: {
      assets(): Promise<Asset[]>;
      import<T = { default: any; [k: string]: any }>(): Promise<T>;
      output: {
        path: string;
      };
    };
  };
  /**
   * Seriazable JSON representation of the manifest
   * Useful for sending to the client and hydrating the runtime
   * by assigning it to `window.manifest`
   */
  json(): object;
  /** Map of assets needed by the inputs and chunks */
  assets(): Promise<{ [key: string]: Asset[] }>;
};
```

Let's look at an example of how to use the manifest API.

```ts
import { getManifest } from "vinxi/manifest";
import { eventHandler } from "vinxi/http"

export default eventHandler(() => {
	const clientManifest = getManifest("client");
	const assets = await clientManifest[clientManifest.handler].assets();

	return renderPageWithPreloadLinks({
		assets,
	});
})
```

You can also get the list of assets in the client. This is usually required to match the server-side rendered content on the client during hydration:

```ts
import { getManifest } from "vinxi/manifest";

const clientManifest = getManifest("client");
const assets = await clientManifest[clientManifest.handler].assets();

// use assets in hydration
```