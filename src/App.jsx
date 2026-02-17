import { useState } from 'react'
import './App.css'
import LandingPage from "./pages/LandingPage"


export default function App() {
  // const [isAuthed, setIsAuthed] = useState(false)

  // return isAuthed ? (
  //   <FeedPage onLogout={() => setIsAuthed(false)} />
  // ) : (
  //   <LandingPage
  //     onLoginClick={() => setIsAuthed(true)}
  //     onSignupClick={() => setIsAuthed(true)}
  //   />
  // )

  return <LandingPage
      onLoginClick={() => {}}
      onSignupClick={() => {}}
    />
}
