import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext)
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnLineUsers] = useState([])
    const user = useRecoilValue(userAtom)
    console.log(user?.id, 'userId?')

    useEffect(() => {
        const socket = io("http://localhost:5000", {
            query: {
                userId: user?.id,
            },
        });
        //   console.log(socket,'socket')
        setSocket(socket)

        socket.on("getOnlineUsers", (users) => {
            setOnLineUsers(users);
        });

        return () => socket && socket.close();
    }, [user?.id])


    console.log(onlineUsers, "online users")

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    )
}