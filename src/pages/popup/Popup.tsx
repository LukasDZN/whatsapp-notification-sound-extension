import guitarAlertUrl from '@assets/audio/mixkit-guitar-notification-alert-2320.wav'
import popAlertAudioUrl from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
import positiveAlertUrl from '@assets/audio/mixkit-positive-notification-951.wav'
import startAlertUrl from '@assets/audio/mixkit-software-interface-start-2574.wav'
import logo from '@assets/img/whatsound_logo_500x500_v1.svg'
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
  const [selectedAudioUrl, setselectedAudioUrl] = useState('')

  // Get saved audio from local storage and highlight the button
  useEffect(() => {
    const savedAudio = localStorage.getItem('selectedAudioUrl')
    if (savedAudio) {
      setselectedAudioUrl(savedAudio)
    }
  }, [])

  const updateCachedAudio = async (audioUrl: string) => {
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
          selectedAudioUrl: audioUrl,
        },
        resolve
      )
    })
  }

  const handleSelectAudio = async (audioUrl: string) => {
    setselectedAudioUrl(audioUrl) // Set audio for the current page view
    await updateCachedAudio(audioUrl)
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

  return (
    <div className="App">
      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Select notification audio</h1>
      </header>
      {audioFilesMapping.map((audio) => (
        <div
          key={audio.fileUrl}
          className={`audio-container ${
            selectedAudioUrl === audio.fileUrl ? 'selected' : ''
          }`}
        >
          <h2>{audio.displayName}</h2>
          <button
            className="button button-left"
            onClick={() => handlePlayAudio(audio.fileUrl)}
          >
            Play
          </button>
          <button
            className="button button-right"
            onClick={() => handleSelectAudio(audio.fileUrl)}
          >
            Select
          </button>
          <button className="button-volume">
            <input
              id="button-vol-input"
              type="range"
              min="0"
              max="100"
              step="0.1"
              data-np-intersection-state="visible"
            />
          </button>
        </div>
      ))}
      {/* This could be a google form */}
      {/* <a href="www.testpage.com">Get in touch</a> */}
    </div>
  )
}

export default Popup
