
interface Props {
    setName: (name: string) => void;
    setRoomId: (roomId: string) => void;
    setJoined: (joined: boolean) => void;
  }


const CreateRoomForm = ({setName, setRoomId, setJoined} : Props) => {

    function joinHandler(e: React.FormEvent){
        e.preventDefault();
        setJoined(true);
    }

  return (
    <div className='w-[100%] h-full flex items-center justify-center'>
        <form className='w-[90%] sm:w-[80%] flex flex-col gap-5'>
            <div className='flex flex-col gap-2'>
                <div>
                    Name :
                </div>
                <div className='border py-2 px-4'>
                    <input type='text' placeholder='Mayank' className='w-[100%] outline-0' onChange={(e)=>setName(e.target.value)}/>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                <div>
                    Create Room Code:
                </div>
                <div className='w-full border py-2 px-4'>
                    <input type='text' placeholder='Room Code' className='w-[100%] outline-0' onChange={(e)=>setRoomId(e.target.value)}/>
                </div>
            </div>
            <button onClick={joinHandler} className='bg-stone-600 py-2 cursor-pointer hover:bg-gray-700 transition-all duration-300'>Create/Join Room</button>
        </form>
    </div>
  )
}

export default CreateRoomForm