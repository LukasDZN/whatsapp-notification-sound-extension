import popAlertAudioUrl from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
import guitarAlertUrl from '@assets/audio/mixkit-guitar-notification-alert-2320.wav'
import positiveAlertUrl from '@assets/audio/mixkit-positive-notification-951.wav'
import startAlertUrl from '@assets/audio/mixkit-software-interface-start-2574.wav'
import logo from '@assets/img/logo.svg'
import '@pages/popup/Popup.css'
import { useState } from 'react'

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
  const [selectedAudioUrl, setselectedAudioUrl] = useState('')
  const [audio, setAudio] = useState(null)

  // useEffect(() => {
  //   const savedAudio = localStorage.getItem("selectedAudioUrl");
  //   if (savedAudio) {
  //     setselectedAudioUrl(savedAudio);
  //   }
  // }, []);

  const updateCachedAudio = async () => {
    // Get tab to send message to
    const openTabs = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs)
      })
    })

    // Send message to content script
    await new Promise((resolve) => {
      chrome.tabs.sendMessage(
        openTabs[0].id,
        {
          type: 'updateCachedAudio',
          extensionIdentifierUrl: extensionIdentifierUrl,
          selectedAudioUrl: selectedAudioUrl,
        },
        resolve
      )
    })
  }

  // CLick button to upload mp3 to local extension directory
  // const handleUploadAudio = async (e) => {
  //   const file = e.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = async (e) => {
  //     const audio = e.target.result;
  //     await updateCachedAudio(audio);
  //   };

  const handleSelectAudio = async (audio: string) => {
    // setSelectedAudio(audio); // Set audio for the current page view
    await updateCachedAudio()
    // localStorage.setItem("selectedAudio", audio);
  }

  const handlePlayAudio = (file: string) => {
    const audioElement = new Audio(file)
    // setAudio(audioElement)
    audioElement.play()
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Select notification audio</h1>
        {audioFilesMapping.map((audio) => (
          <div
            key={audio.fileUrl}
            className={`audio-container ${
              selectedAudioUrl === audio.fileUrl ? 'selected' : ''
            }`}
          >
            <button onClick={() => handlePlayAudio(audio.fileUrl)}>Play</button>
            <button onClick={() => handleSelectAudio(audio.fileUrl)}>
              Select
            </button>
            <p>{audio.displayName}</p>
          </div>
        ))}
        {/* This could be a google form */}
        <a href="www.testpage.com">Get in touch</a>
      </header>
    </div>
  )
}

export default Popup
