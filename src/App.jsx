import { useState } from 'react'
import './App.css'
import LandingPage from "./pages/LandingPage"
import SignupPage from './pages/SignupPage'
import FeedPage from './pages/FeedPage'


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

  // return <SignupPage/>
  return <FeedPage/>
}
