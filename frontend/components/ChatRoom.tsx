import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"

const ChatRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, roomId } = location.state || {};

    type MessageType = {
        sender: string;
        message: string;
    };

    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [notification, setNotification] = useState("");


    useEffect(()=>{
        if(!name || !roomId){
            navigate("/");
            return;
        }

        console.log(`${name} ${roomId}`)

        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;

        socket.onopen = ()=>{
            socket.send(
                JSON.stringify({
                    type : "join",
                    payload : {
                        roomId : roomId,
                        name : name
                    }
                })
            )
        }

        socket.onmessage = (event)=>{
            const data = event.data;

            try{
                let parsedData = JSON.parse(data);

                if(parsedData.type === "message"){
                    setMessages((prev)=> [...prev, {sender : parsedData.from, message : parsedData.message}])
                }

                if(parsedData.type === "notification"){
                    setNotification(parsedData.message);
                }
            }catch(err){
                console.log(err);
            }
        }

        return () => {
            socket.close();
          };
    }, [name, roomId]);


    

    function sendHandler(e : React.FormEvent){
        e.preventDefault();
        if(socketRef.current && messageInput.trim()){
            socketRef.current.send(
                JSON.stringify({
                    type : "message",
                    payload : {
                        message : messageInput
                    }
                })
            )
        }
        setMessageInput("");
    }


  return (
    <div className='w-full h-full'>
        <div className='flex flex-col md:flex-row w-[100%] h-[100%]'>
            {/* Left */}
            <div className='w-[100%] md:w-[50%] h-[30%] md:h-[100%] text-[35px] sm:text-[50px] md:text-[40px] lg:text-[50px] flex items-center justify-center'>
                <div className='text-center'>
                    Welcome to your Room
                    <p className='text-[15px] sm:text-[20px]'>
                        Let the conversations floww
                    </p>

                    <div className="flex justify-between mt-8 md:mt-20 w-[90%] mx-auto">
                        <div className="text-sm md:text-lg bg-[#F4F1BB] text-[#090C02] px-4 py-2 rounded-lg"><span className="font-semibold font-space">Name :</span> {name}</div>
                        <div className="text-sm md:text-lg bg-[#F4F1BB] text-[#090C02] px-4 py-2 rounded-lg"><span className="font-semibold font-space">RoomId :</span> {roomId}</div>
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className='w-[100%] md:w-[50%] h-[70%] md:h-[100%]'>
                <div className='w-[100%] h-full mx-auto'>
                    <div className='w-[100%] h-full flex items-center justify-center'>
                        <form className='w-[90%] h-full sm:w-[90%] flex flex-col gap-5 py-5 mx-auto'>
                            <div className={`w-[100%] border h-[100%] overflow-scroll text-center`}>
                                {
                                    notification && <div>{notification}</div>
                                }
                                {/* Show Messages */}
                                {
                                    messages.map((message, index)=>{
                                        return <div key={index} className={`${messageInput === message.message ? "text-end" : "justify-start"} text-white w-[98%] mx-auto`}>
                                            <div className="text-[10px] text-start">{message.sender}</div>
                                            <div className="text-[18px] bg-[#F7FF58] max-w-max px-6 py-1 text-[#020300] rounded-xl">{message.message}</div>
                                        </div>
                                    })
                                }
                            </div>
                            <div className='flex gap-2 w-full'>
                                <div className='flex-1'>
                                    <input type='text' placeholder='Type your message here...' className='outline-0 w-full border py-3 px-2' onChange={(e) => setMessageInput(e.target.value)} value={messageInput}/>
                                </div>
                                <button className='bg-stone-600 py-2 cursor-pointer hover:bg-gray-700 transition-all duration-300 px-12' onClick={sendHandler}>Send</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ChatRoom