import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    console.log("content view loaded");
  }, []);

  async function updateCachedAsset(
    cacheName: string,
    oldAssetURL: string,
    newAssetURL: string
  ) {
    console.log("updateCachedAsset function started");
    const cache = await caches.open(cacheName);
    console.log(`Cache '${cacheName}' was opened: ${cache}`);

    const cachedResponse = await cache.match(oldAssetURL);

    if (cachedResponse) {
      // If the asset is in the cache, fetch the new version from the network and update the cache
      const response = await fetch(newAssetURL);
      console.log(`Replacement for old cache: ${response}`);

      cache.delete(oldAssetURL);

      cache.put(oldAssetURL, response);
    }
  }

  updateCachedAsset(
    "wa2.2306.7",
    "https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3",
    "https://web.whatsapp.com/sequential-ptt-end_62ed28be622237546fd39f9468a76a49.mp3"
  );

  return <div className="content-view">content view</div>;
}
