// Audio files
import guitarAlertUrl from '@assets/audio/mixkit-guitar-notification-alert-2320.wav'
import popAlertAudioUrl from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
import positiveAlertUrl from '@assets/audio/mixkit-positive-notification-951.wav'
import startAlertUrl from '@assets/audio/mixkit-software-interface-start-2574.wav'
import clop_1 from '@assets/audio/1.mp3'
import bloop_2 from '@assets/audio/2.mp3'
import ding_ding_3 from '@assets/audio/3.mp3'
import some_notification_4 from '@assets/audio/4.mp3'
import harp_5 from '@assets/audio/5.mp3'

// Images
import logo from '@assets/img/whatsound_logo.png'

// CSS
import '@pages/popup/Popup.scss'

// Other
import { useEffect, useState } from 'react'

// Get unique extension string (URL)
const extensionIdentifierUrl = chrome.runtime.getURL('')

const audioFilesMapping = [
  { displayName: 'Pop', fileUrl: popAlertAudioUrl },
  {
    displayName: 'Chill guitar',
    fileUrl: guitarAlertUrl,
  },
  {
    displayName: 'Positive',
    fileUrl: positiveAlertUrl,
  },
  {
    displayName: 'Start',
    fileUrl: startAlertUrl,
  },
  {
    displayName: 'Clop',
    fileUrl: clop_1,
  },
  {
    displayName: 'Bloop',
    fileUrl: bloop_2,
  },
  {
    displayName: 'Ding ding',
    fileUrl: ding_ding_3,
  },
  {
    displayName: 'Some notification',
    fileUrl: some_notification_4,
  },
  {
    displayName: 'Harp',
    fileUrl: harp_5,
  },
]

const Popup = () => {
  // Check if the extension is opened within WhatsApp web tab.
  // (otherwise, it will not work)
  const [openTabId, setOpenTabId] = useState(0)
  const [isWhatsAppWeb, setIsWhatsAppWeb] = useState(false)

  // Get and set tab to send message to
  useEffect(() => {
    const savedAudio = localStorage.getItem('selectedAudioUrl')
    if (savedAudio) {
      setSelectedAudioUrl(savedAudio)
    }

    const checkIsWhatsAppWeb = async () => {
      // Get tab to send message to
      const openTabs = await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          resolve(tabs)
        })
      })
      setOpenTabId(openTabs[0].id)

      const response = await sendMessageToContentScript(openTabs[0].id, {
        type: 'checkIfWhatsAppWeb',
      })

      if (response.isWhatsAppWeb) {
        setIsWhatsAppWeb(true)
      } else {
        setIsWhatsAppWeb(false)
      }
    }
    checkIsWhatsAppWeb()
  }, [])

  // Display currently selected audio
  const [selectedAudioUrl, setSelectedAudioUrl] = useState('')

  const handleSelectAudio = async (audioUrl: string) => {
    // Set audio for the current page view
    setSelectedAudioUrl(audioUrl)
    // Update cached audio
    sendMessageToContentScript(openTabId, {
      type: 'updateCachedAudio',
      extensionIdentifierUrl: extensionIdentifierUrl,
      selectedAudioUrl: audioUrl,
    })
    localStorage.setItem('selectedAudioUrl', audioUrl)
  }

  const handlePlayAudio = (audioUrl: string) => {
    const audioElement = new Audio(audioUrl)
    audioElement.play()
  }

  // TODO - Add upload audio feature
  // CLick button to upload mp3 to local extension directory
  // const handleUploadAudio = async (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const audio = e.target.result;
  //     await updateCachedAudio(audio);
  //   };

  const renderAudioButtons = () => {
    return audioFilesMapping.map((audio) => (
      <div
        key={audio.fileUrl}
        className={`audio-container ${
          selectedAudioUrl === audio.fileUrl ? 'selected' : ''
        }`}
      >
        <h2>{audio.displayName} &#9835;</h2>
        <button
          className="button button-left"
          onClick={() => handlePlayAudio(audio.fileUrl)}
        >
          Play
        </button>
        {selectedAudioUrl !== audio.fileUrl && (
          <button
            className="button button-right"
            onClick={() => handleSelectAudio(audio.fileUrl)}
          >
            Select
          </button>
        )}
      </div>
    ))
  }

  const renderInstructions = () => {
    return (
      <div id="instructions">
        <h2>Please go to WhatsApp Web page to change the settings!</h2>
        <p>
          <i>
            (or <u>refresh</u> the page if you are already there)
          </i>
        </p>
      </div>
    )
  }

  const renderIntro = () => {
    return (
      <div id="titleInstructions">
        <ol>
          <li>
            <u>Select</u> notification audio
          </li>
          <li>
            <u>Refresh</u> WhatsApp web page
          </li>
          <li>Enjoy!</li>
        </ol>
        <p id="reset-audio-tip">
          To reset audio to default, please clear the browser cache.
        </p>
      </div>
    )
  }

  // const renderResetAudioButton = () => {
  //   return (
  //     <button
  //       className="button"
  //       onClick={() => handleResetAudio()}
  //     >
  //       Set audio to original
  //     </button>
  //   )
  // }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      {isWhatsAppWeb && renderIntro()}
      {isWhatsAppWeb ? renderAudioButtons() : renderInstructions()}
      {/* {isWhatsAppWeb && renderResetAudioButton()} */}
      <address>
        <a id="get-in-touch" href="mailto:dzenk.lukas@gmail.com" target="_top">
          {'>'}Get in touch{'<'}
        </a>
      </address>
    </div>
  )
}

const sendMessageToContentScript = async (
  openTab: number,
  messageObject: object
): Promise<{ [key: string]: string }> => {
  console.log('sendMessageToContentScript called: ', openTab, messageObject)

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(openTab, messageObject, resolve)
  })
}

// Volume slider
{
  /* <button className="button-volume">
            <input
              id="button-vol-input"
              type="range"
              min="0"
              max="100"
              step="0.1"
              data-np-intersection-state="visible"
            />
          </button> */
}

export default Popup
