import popAlertAudioUrl from '@assets/audio/mixkit-message-pop-alert-2354.mp3'
import logo from '@assets/img/logo.svg'
import '@pages/popup/Popup.css'
import { useState } from 'react'

const audioFiles = [
  { name: 'Pop', file: popAlertAudioUrl },
  // {
  //   name: "Chill guitar",
  //   file: "./audioFiles/mixkit-guitar-notification-alert-2320.wav",
  // },
  // {
  //   name: "Positive",
  //   file: "./audioFiles/mixkit-positive-notification-951.wav",
  // },
  // {
  //   name: "Start",
  //   file: "./audioFiles/mixkit-software-interface-start-2574.wav",
  // },
]

// src/pages/popup/audioFiles/mixkit-guitar-notification-alert-2320.wav

const Popup = () => {
  const [selectedAudio, setSelectedAudio] = useState('')
  const [audio, setAudio] = useState(null)

  // useEffect(() => {
  //   const savedAudio = localStorage.getItem("selectedAudio");
  //   if (savedAudio) {
  //     setSelectedAudio(savedAudio);
  //   }
  // }, []);

  const updateCachedAudio = async () => {
    const tabs = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs)
      })
    })

    // const audio = await getAudioBase64FromLocalUrl(popAlertAudioUrl)

    await new Promise((resolve) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          type: 'updateCachedAudio',
          audio,
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
        {audioFiles.map((audio) => (
          <div
            key={audio.file}
            className={`audio-container ${
              selectedAudio === audio.file ? 'selected' : ''
            }`}
          >
            <button onClick={() => handlePlayAudio(audio.file)}>Play</button>
            <button onClick={() => handleSelectAudio(audio.file)}>
              Select
            </button>
            <p>{audio.name}</p>
          </div>
        ))}
        <a href="www.testpage.com">Go to extension page</a>
      </header>
    </div>
  )
}

export default Popup
