// import React from "react";
// import logo from "@assets/img/logo.svg";
// import "@pages/popup/Popup.css";

// const Popup = () => {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/pages/popup/Popup.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React!
//         </a>
//       </header>
//     </div>
//   );
// };

// export default Popup;

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

  // ?NOTE: this works
  const getAudioBase64FromLocalUrl = async (audioUrl: string) => {
    // Fetch the audio file given local file URL
    const audioFile = await fetch(audioUrl)
    // Convert the audio file to a blob
    const audioBlob = await audioFile.blob() // send this to content script
    // // Create a new audio element
    // const audioElement = new Audio()
    // // Set the audio element's source to the blob
    // audioElement.src = URL.createObjectURL(audioBlob)
    // // Play the audio
    // audioElement.play()

    // ---

    // Convert the blob to a base64 string
    const audioBase64 = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      // converts the blob to base64 and calls onload
      reader.readAsDataURL(audioBlob)
    })
    console.log('audioBase64', audioBase64)
    // Create new Audio object with base64 string and play the audio
    // const audioElement = new Audio(audioBase64 as string).play()

    return audioBase64
  }

  const updateCachedAudio = async () => {
    const tabs = await new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs)
      })
    })

    const audio = await getAudioBase64FromLocalUrl(popAlertAudioUrl)

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

  const handleSelectAudio = async (audio: string) => {
    // Validate the audio by playing it
    const audioBlob = new Blob([popAlertAudioUrl], { type: 'audio/mpeg' })
    const audioElement = new Audio(audio)

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
