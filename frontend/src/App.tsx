import './App.css'
import CreateRoom from '../components/CreateRoom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ChatRoom from '../components/ChatRoom';

function App() {

  return (
    <div className='w-[100vw] h-[100vh] bg-[#090C02] text-white font-montserrat'>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateRoom/>} />
          <Route path="/room" element={<ChatRoom/>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
