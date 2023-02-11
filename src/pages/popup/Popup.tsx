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

import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import { useEffect, useState } from "react";

const audioFiles = [
  { name: "Audio1", file: "audio1.mp3" },
  { name: "Audio2", file: "audio2.mp3" },
  { name: "Audio3", file: "audio3.mp3" },
  { name: "Audio4", file: "audio4.mp3" },
];

const Popup = () => {
  const [selectedAudio, setSelectedAudio] = useState("");

  useEffect(() => {
    const savedAudio = localStorage.getItem("selectedAudio");
    if (savedAudio) {
      setSelectedAudio(savedAudio);
    }
  }, []);

  const handleSelectAudio = (audio) => {
    setSelectedAudio(audio);
    localStorage.setItem("selectedAudio", audio);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Select notification audio</h1>
        {audioFiles.map((audio) => (
          <div
            key={audio.file}
            className={`audio-container ${
              selectedAudio === audio.file ? "selected" : ""
            }`}
          >
            <button onClick={() => console.log("Play audio")}>Play</button>
            <button onClick={() => handleSelectAudio(audio.file)}>
              Select
            </button>
            <p>{audio.name}</p>
          </div>
        ))}
        <a href="www.testpage.com">Go to extension page</a>
      </header>
    </div>
  );
};

export default Popup;
