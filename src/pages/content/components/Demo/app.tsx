import popAlertAudio from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
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

  async function updateCachedAsset(
    cacheName = 'wa2.2306.7',
    oldAssetURL = 'https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3',
    audioFile = popAlertAudio
    // newAssetURL
  ) {
    // Find and open the cache that contains the asset
    console.log('updateCachedAsset function started')
    const cache = await caches.open(cacheName)
    console.log(`Cache '${cacheName}' was opened: ${cache}`)

    // Create a mock response object using the local mp3 file
    // Body
    // const reader = new FileReader();
    // const blob = new Blob([pop], { type: "text/plain" });
    // reader.readAsArrayBuffer(blob);
    // reader.onloadend = () => {
    //   const response = reader.result;
    //   // Do something with response object
    // };

    // import popAlertAudio from "@assets/audio/mixkit-message-pop-alert-2354.mp3";

    console.log(popAlertAudio)

    const convertImportedMp3ToResBody = async (importedMp3: string) => {
      // Covnert the imported mp3 file from a string to an ArrayBuffer
      const blob = new Blob([importedMp3], { type: 'audio/mpeg' })
      console.log(`Blob: `, blob)

      return blob
      // return blob.arrayBuffer();

      // return new Promise<ArrayBuffer>((resolve) => {
      //   const reader = new FileReader();
      //   reader.readAsArrayBuffer(blob);
      //   reader.onloadend = () => {
      //     resolve(reader.result as ArrayBuffer);
      //   };
      // });
    }
    const body = await convertImportedMp3ToResBody(popAlertAudio)

    // Options
    const myOptions = {
      status: 200,
      headers: { 'Response-Type': 'basic', 'Content-Type': 'audio/mpeg3' }, // mpeg3 because whatsapp uses it
      type: 'basic',
      url: 'https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3',
    }
    const response = new Response(body, myOptions)

    console.log(`Reponse: `, response)
    const compareBody = await fetch(
      'https://web.whatsapp.com/notification_2a485d84012c106acef03b527bb54635.mp3'
    )
    console.log(`CompareResponse: `, compareBody)

    cache.delete(oldAssetURL)

    cache.put(oldAssetURL, response)
  }

  // // Listen to messages from the popup
  // chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   if (request.type === "updateCachedAsset") {
  //     updateCachedAsset();
  //   }
  // });

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('message received in content script', request)
    if (request.type === 'updateCachedAsset') {
      const requestAudioUnknownType = request.audio
      console.log(
        'content script requestAudioUnknownType',
        requestAudioUnknownType
      )

      const audioBlob = new Blob([request.audio], { type: 'audio/mpeg' })
      console.log('content script audioBlob', audioBlob)

      // Create a new audio element
      const audioElement = new Audio()
      // Set the audio element's source to the blob
      audioElement.src = URL.createObjectURL(audioBlob)
      // Play the audio
      audioElement.play()
      // updateCachedAsset();
    }
    sendResponse({ type: 'updateCachedAssetDone' })

    return true
  })

  return <div className="content-view">content view</div>
}
