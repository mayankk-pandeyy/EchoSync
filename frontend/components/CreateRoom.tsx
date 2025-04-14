import { useEffect, useState } from 'react';
import CreateRoomForm from './CreateRoomForm';
import { useNavigate } from 'react-router-dom';


const CreateRoom = () => {

    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [joined, setJoined] = useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        if(joined){
            navigate("/room", { state: { name, roomId } });
        }
    }, [joined])

  return (
    <div className='w-full h-full'>
        <div className='flex flex-col md:flex-row w-[100%] h-[100%]'>
            {/* Left */}
            <div className='w-[100%] md:w-[50%] h-[30%] md:h-[100%] text-[35px] sm:text-[50px] md:text-[40px] lg:text-[50px] flex items-center justify-center'>
                <div className='text-center'>
                    Create Your Room
                    <p className='text-[15px] sm:text-[20px]'>
                        Let the conversations floww
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className='w-[100%] md:w-[50%] h-[70%] md:h-[100%]'>
                <div className='w-[100%] sm:w-[90%] h-full mx-auto'>
                    <CreateRoomForm setName={setName} setRoomId={setRoomId} setJoined={setJoined}/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateRoom