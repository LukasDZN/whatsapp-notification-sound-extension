export default function App() {
  const updateCachedAudio = async () => {
    // Get the cache name which has the notification audio asset
    const cacheNames = await caches.keys()
    // Find the cache that contains the asset
    // This is done because cache name is always changing
    const cacheName = cacheNames.find((name) => {
      const regex = /wa\d{1}\./
      return regex.test(name)
    })

    // Open the cache that contains the audio asset
    const cache = await caches.open(cacheName)

    // Get the notification audio asset URL
    const cacheAssets = await caches.open(cacheName)
    const assets = await cacheAssets.keys()
    // Find the asset that we want to update
    const asset = assets.find((asset) => {
      const regex = /notification_.+\.mp3/
      return regex.test(asset.url)
    })
    const assetUrl = asset.url

    // Get unique extension string (URL)
    chrome.runtime.getURL(
      'assets/mp3/audioMixkit-message-pop-alert-2354.chunk.mp3'
    )

    const extensionAudioResponse = await fetch(
      'chrome-extension://kfljpifignclbjlanpifanjfimepkibk/assets/mp3/audioMixkit-message-pop-alert-2354.chunk.mp3'
    )

    const body = extensionAudioResponse.body

    const newResponse = new Response(body)

    await cache.delete(assetUrl)
    await cache.put(assetUrl, extensionAudioResponse)
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('message received in content script', request)
    if (request.type === 'updateCachedAudio') {
      updateCachedAudio()
    }

    sendResponse({ type: 'updateCachedAudioDone' })

    return true
  })

  return
}
