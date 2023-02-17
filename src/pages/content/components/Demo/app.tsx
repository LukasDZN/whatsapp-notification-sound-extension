export default function App() {
  let extensionIdentifierUrl: string

  const updateCachedAudio = async (selectedAudioUrl: string) => {
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

    const extensionAudioResponse = await fetch(
      extensionIdentifierUrl + selectedAudioUrl
    )

    const body = extensionAudioResponse.body

    // Create a new mock response with the updated audio
    // to replace the old one in the cache
    const newResponse = new Response(body)

    await cache.delete(assetUrl)
    await cache.put(assetUrl, newResponse)
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('message received in content script', request)

    if (request.type === 'updateCachedAudio') {
      extensionIdentifierUrl = request.extensionIdentifierUrl
      updateCachedAudio(request.selectedAudioUrl)
    }

    sendResponse({ type: 'updateCachedAudioDone' })

    return true // Needed to ensure that the connection is not closed prematurely
  })

  return
}
