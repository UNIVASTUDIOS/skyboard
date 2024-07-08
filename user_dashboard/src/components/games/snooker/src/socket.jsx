import { io } from "socket.io-client"

const dev = `http://localhost`;
// const prod = `https://new-server-ozkr.onrender.com/snooker`;
// const dev = `http://skyboardgames.com`;
const prod = `http://skyboardgames.com`;

const URL = process.env.NODE_ENV === "development" ? dev : prod;

const socket = io(URL + '/snooker', {
    autoConnect: false,
    path: '/games/socket.io'
});

export default socket;