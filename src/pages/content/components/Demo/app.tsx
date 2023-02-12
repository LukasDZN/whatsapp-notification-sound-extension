import { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    console.log('content view loaded')
  }, [])

  // async function updateCachedAsset(
  //   cacheName: string,
  //   oldAssetURL: string,
  //   newAssetURL: string
  // ) {
  //   console.log("updateCachedAsset function started");
  //   const cache = await caches.open(cacheName);
  //   console.log(`Cache '${cacheName}' was opened: ${cache}`);

  //   const cachedResponse = await cache.match(oldAssetURL);

  //   if (cachedResponse) {
  //     // If the asset is in the cache, fetch the new version from the network and update the cache
  //     const response = await fetch(newAssetURL);
  //     console.log(`Replacement for old cache: ${response}`);

  //     cache.delete(oldAssetURL);

  //     cache.put(oldAssetURL, response);
  //   }
  // }

  // updateCachedAsset(
  //   "wa2.2306.7",
  //   "https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3",
  //   "https://web.whatsapp.com/sequential-ptt-end_62ed28be622237546fd39f9468a76a49.mp3"
  // );

  document.querySelector('html').addEventListener('click', () => {
    console.log('html clicked')
  })

  const updateCachedAudio = async (audioBase64: string) => {
    const cacheName = 'wa2.2306.7'
    const oldAssetURL =
      'https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3'

    // Test whether the audio plays
    // const audioElement = new Audio(audioBase64).play()

    // Create a new blob from the base64 string
    // const audioBlob = new Blob([audioBase64], { type: 'audio/mpeg' })
    // console.log('content script audioBlob', audioBlob)
    const audioBlob = audioBase64

    // Find and open the cache that contains the asset
    console.log('updateCachedAsset function started')
    const cache = await caches.open(cacheName)
    console.log(`Cache '${cacheName}' was opened: ${cache}`)

    // * Get the response from the cache (note: this works)
    // const inbuiltWhatsappAudioResponse = await fetch(
    //   'https://web.whatsapp.com/sequential-ptt-middle_7fa161964e93db72b8d00ae22189d75f.mp3'
    // )
    // console.log(`InbuiltWhatsappAudioResponse: `, inbuiltWhatsappAudioResponse)
    // await cache.delete(oldAssetURL)
    // await cache.put(oldAssetURL, inbuiltWhatsappAudioResponse)
    // return
    // * Reset the audio to the default whatsapp audio
    // await cache.delete(oldAssetURL)
    // return
    // * Confirm
    // new Audio('/notification_2a485d84012c106acef03b527bb54635.mp3').play()
    // new Audio('/sequential-ptt-end_62ed28be622237546fd39f9468a76a49.mp3').play() // this is random test
    // Might need a refresh of the page after clearing the cache

    // ---

    // // Create a new audio element
    // const audioElement = new Audio()
    // // Set the audio element's source to the blob
    // audioElement.src = URL.createObjectURL(audioBlob)
    // console.log('content script audioElement.src', audioElement)
    // // Play the audio
    // audioElement.play()

    console.log(`AudioBlob within updateCachedAudio function: `, audioBlob)

    // Options
    const headers = {
      'Response-Type': 'basic',
      'Content-Type': 'audio/mpeg',
      'Content-Length': '420',
    } // mpeg3 because whatsapp uses it
    const status = { status: 200 }
    const myOptions = {
      ...headers,
      ...status,
    }

    const body = audioBlob
    // const body = JSON.stringify(audioBlob.stream())

    const newResponse = new Response(body, myOptions)

    console.log(`Reponse: `, newResponse)

    // An example of what a working response looks like (if written to cache it would work properly)
    const compareBody = await fetch(
      'https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3'
    )
    console.log(`CompareResponse: `, compareBody)

    await cache.delete(oldAssetURL)
    await cache.put(oldAssetURL, newResponse)
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('message received in content script', request)
    if (request.type === 'updateCachedAudio') {
      const audioBase64 = request.audio as string
      console.log('content script audioBase64', typeof audioBase64)

      updateCachedAudio(audioBase64)
    }
    sendResponse({ type: 'updateCachedAudioDone' })

    return true
  })

  return <div className="content-view">content view</div>
}
