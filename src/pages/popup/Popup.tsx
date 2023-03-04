import guitarAlertUrl from '@assets/audio/mixkit-guitar-notification-alert-2320.wav'
import popAlertAudioUrl from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
import positiveAlertUrl from '@assets/audio/mixkit-positive-notification-951.wav'
import startAlertUrl from '@assets/audio/mixkit-software-interface-start-2574.wav'
import logo from '@assets/img/whatsound_logo.png'
import '@pages/popup/Popup.scss'
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
]

const Popup = () => {
  const [openTab, setOpenTab] = useState(0)
  // Check if the extension is opened within WhatsApp web tab.
  // (otherwise, it will not work)
  const [isWhatsAppWeb, setIsWhatsAppWeb] = useState(false)
  // Get and set tab to send message to
  console.log('should start useEffect')
  useEffect(() => {
    const savedAudio = localStorage.getItem('selectedAudioUrl')
    if (savedAudio) {
      setselectedAudioUrl(savedAudio)
    }

    console.log('useEffect starting')
    const checkIsWhatsAppWeb = async () => {
      console.log(1)
      // Get tab to send message to
      const openTabs = await new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          resolve(tabs)
        })
      })
      setOpenTab(openTabs[0].id)

      console.log(2)

      const response = await sendMessageToContentScript(openTab, {
        type: 'checkIfWhatsAppWeb',
      })
      console.log(response)
      response.isWhatsAppWeb === 'true'
        ? setIsWhatsAppWeb(true)
        : setIsWhatsAppWeb(false)
    }
    checkIsWhatsAppWeb()
  }, [])

  console.log('openTab: ', openTab)
  console.log('isWhatsAppWeb: ', isWhatsAppWeb)

  // Display currently selected audio
  const [selectedAudioUrl, setselectedAudioUrl] = useState('')

  const handleSelectAudio = async (audioUrl: string) => {
    // Set audio for the current page view
    setselectedAudioUrl(audioUrl)
    // Update cached audio
    sendMessageToContentScript(openTab, {
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
        <h2>Please navigate to a WhatsApp Web page to change the settings!</h2>
        <p>
          <i>(or refresh the page if you are already there)</i>
        </p>
      </div>
    )
  }

  const renderIntro = () => {
    return (
      <div id="titleInstructions">
        <ol>
          <li>Select notification audio</li>
          <li>Refresh WhatsApp web page</li>
          <li>Enjoy!</li>
        </ol>
      </div>
    )
  }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="logo" />
      {isWhatsAppWeb && renderIntro()}
      {isWhatsAppWeb ? renderAudioButtons() : renderInstructions()}
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
