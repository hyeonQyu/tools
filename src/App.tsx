import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Tools</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          PWA React + TypeScript + Vite 프로젝트
        </p>
      </div>
      <p className="read-the-docs">
        React Router가 설정되어 있습니다. <Link to="/about">About 페이지</Link>로 이동해보세요.
      </p>
    </>
  )
}

function About() {
  return (
    <div>
      <h1>About 페이지</h1>
      <p>이 프로젝트는 PWA 기능이 포함된 React 애플리케이션입니다.</p>
      <p>
        <Link to="/">홈으로 돌아가기</Link>
      </p>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  )
}

export default App
