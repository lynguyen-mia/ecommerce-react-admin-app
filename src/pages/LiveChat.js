import { useEffect, useState, useRef } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import styles from "./LiveChat.module.css";
import { getVariable } from "../utils/getLocalVar.js";
import openSocket from "socket.io-client";

const LiveChat = () => {
  const socket = openSocket("https://ecommerce-node-app-sfau.onrender.com");
  const navigate = useNavigate();
  const [roomList, setRoomList] = useState([]);
  const [curRoom, setCurRoom] = useState();
  const [messages, setMessages] = useState([]);
  const [roomsWithNewChat, setRoomsWithNewChat] = useState([]);
  const messageRef = useRef();
  const currentRoomId = useRef();
  const adminUser = getVariable("adminUser");

  // FUNCTIONS
  // Check user expiration
  async function checkSession() {
    const res = await fetch(
      "https://ecommerce-node-app-sfau.onrender.com/admin/check-session",
      {
        credentials: "include",
      }
    );
    if (res.status === 401) {
      localStorage.removeItem("adminUser");
    }
  }

  // Fetch all chat room IDs & first room's data from server
  async function fetchRooms() {
    const res = await fetch(
      "https://ecommerce-node-app-sfau.onrender.com/admin/chat/roomlist",
      {
        credentials: "include",
      }
    );

    if (res.status === 401) {
      window.alert("Your session has expired, please log in again");
      return window.location.replace("/auth");
    }
    const results = await res.json();
    setRoomList(results.rooms);
    setCurRoom(results.firstRoom);
    // Load previous messages
    fetchedPrevMessages(results.firstRoom);
  }

  function handleNewRoom(data) {
    setRoomsWithNewChat((prev) => [...prev, data.roomId]);
    // If there's no room in room list, change the main content view to this new room
    if (roomList.length === 0) {
      setCurRoom(data.roomId);
      onClickRoom(data.roomId);
    }
    // Add new room to room list
    setRoomList((prevState) => [...prevState, data.roomId]);
  }

  async function handleChatRes(data) {
    if (curRoom.roomId !== data.roomId) {
      setRoomsWithNewChat((prev) => [...prev, data.roomId]);
    }
    if (curRoom.roomId === data.roomId) {
      // Messages = [{content, name, role, userId}, {}...]
      setMessages((prevState) => [...prevState, data.message]);
    }
    // Check session expiration
    const res = await fetch(
      "https://ecommerce-node-app-sfau.onrender.com/admin/check-session",
      {
        credentials: "include",
      }
    );
    if (res.status === 401) {
      window.alert("Your session has expired. Please sign in again.");
      return navigate("/auth");
    }
  }

  function endChat(data) {
    if (curRoom.roomId === data.roomId) {
      setMessages([]);
      setRoomList((prevState) => prevState.filter((r) => r !== data.roomId));
    }
  }

  function fetchedPrevMessages(room) {
    const messages = [];
    room?.messages?.forEach((messObj) => {
      messages.push(messObj);
    });
    setMessages(messages);
  }

  async function onClickRoom(roomId) {
    try {
      currentRoomId.current.textContent = roomId;
      setRoomsWithNewChat((prev) => prev.filter((p) => p !== roomId));
      const res = await fetch(
        `https://ecommerce-node-app-sfau.onrender.com/admin/chat/room?id=${roomId}`,
        {
          credentials: "include",
        }
      );
      if (res.status === 401) {
        window.alert("Your session has expired, please log in again");
        return window.location.replace("/auth");
      }
      const results = await res.json();
      setCurRoom(results.room);
      fetchedPrevMessages(results.room);
    } catch (err) {
      console.log(err);
    }
  }

  function onSendMessage(e) {
    if (e.key === "Enter") {
      sendMessage();
      e.preventDefault(); // prevent jumping to a new line
    }
  }

  function sendMessage() {
    if (!curRoom) {
      messageRef.current.value = "";
      return window.alert("There's no active room chat right now.");
    }
    const message = messageRef.current.value;
    socket.emit("chat", {
      roomId: curRoom.roomId,
      message: message,
      user: { userId: adminUser.userId, name: adminUser.name, role: "admin" },
    });
    messageRef.current.value = "";
  }

  async function onSearchRoom(e) {
    try {
      if (e.key === "Enter") {
        if (!curRoom) {
          messageRef.current.value = "";
          return window.alert("There's no active room chat right now.");
        }

        const roomId = e.target.value;

        const res = await fetch(
          `https://ecommerce-node-app-sfau.onrender.com/admin/search/chat?id=${roomId}`,
          { credentials: "include" }
        );
        if (res.status === 401) {
          window.alert("Your session has expired, please log in again");
          return window.location.replace("/auth");
        }
        const results = await res.json();
        setRoomList(results.room);
        setMessages([]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  function onEndChat() {
    socket.emit("endChat", { roomId: curRoom?.roomId });
    currentRoomId.current.textContent = "";
  }

  useEffect(() => {
    checkSession();
  }, [adminUser]);

  useEffect(() => {
    fetchRooms();
    return () => {
      setRoomList([]);
      setCurRoom(null);
      setMessages([]);
    };
  }, []);

  useEffect(() => {
    // Listen to events from server
    socket.on("newRoom", handleNewRoom);
    socket.on("chatRes", handleChatRes);
    socket.on("endChat", endChat);
    // prevent duplicate messages
    return () => {
      socket.off("chatRes", handleChatRes);
      socket.off("newRoom", handleNewRoom);
      socket.off("endChat", endChat);
    };
  }, [socket, curRoom]);

  return (
    <div className="container-fluid mb-0 px-4" id={styles["chat-box"]}>
      <div id={styles["livechat-header"]}>
        <div className="fs-4 fw-bold">Chat Rooms</div>
        <Link to="/">Back to admin</Link>
      </div>

      {adminUser ? (
        <div
          id={styles["livechat-content"]}
          className="row border rounded-1 pb-0"
        >
          <div
            className={`col col-3 border-end d-flex flex-column align-items-center p-0 h-100 ${styles["left-col"]}`}
          >
            {/* Search input */}
            <input
              type="text"
              name="livechat-search"
              placeholder="Search Room"
              className={styles["search-box"]}
              onKeyDown={onSearchRoom}
            />
            {/* Chat room lists */}
            <div
              className={`d-flex flex-column h-100 w-100 overflow-auto ${styles["room-list"]}`}
            >
              {roomList &&
                roomList.length > 0 &&
                roomList.map((roomId) => {
                  const classes =
                    "d-flex justify-content-start align-items-center w-100 py-2 overflow-hidden";
                  const hasNewMess = roomsWithNewChat.some(
                    (room) => room === roomId.toString()
                  );
                  const isNotCurrentRoom = roomsWithNewChat.some(
                    (room) => room !== curRoom?.roomId.toString()
                  );
                  return (
                    <div
                      key={roomId}
                      className={
                        roomId === curRoom?.roomId
                          ? styles["room-active"] + " " + classes
                          : classes
                      }
                      onClick={(e) => onClickRoom(e.target.textContent)}
                    >
                      <i className="bi bi-chat-right-dots me-3 fs-3 text-secondary"></i>
                      <span
                        className={
                          hasNewMess && isNotCurrentRoom
                            ? styles["new-chat"]
                            : styles["roomid"]
                        }
                      >
                        {roomId}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Chat content */}
          <div className="col col-9 h-100 px-0 d-flex flex-column">
            <div className="d-flex justify-content-between align-items-center p-3 bg-light border-bottom">
              <div>
                {curRoom && (
                  <strong className="font-monospace">
                    ROOM ID:
                    <span ref={currentRoomId}>{curRoom.roomId || ""}</span>
                  </strong>
                )}
              </div>
              <div className={styles["chat_box__endChat"]} onClick={onEndChat}>
                End Chat
              </div>
            </div>
            <div className={styles["chat-messages"]}>
              <div
                id={styles["messages-container"]}
                className="d-flex flex-column gap-2 mb-2 p-4 w-100 overflow-auto"
              >
                {messages &&
                  messages.length > 0 &&
                  messages.map((mess, index) => {
                    return (
                      <div
                        className={
                          mess.role === "customer"
                            ? "d-flex justify-content-start w-100"
                            : "w-100 d-flex align-items-center justify-content-end"
                        }
                        key={index}
                      >
                        {mess.role === "customer" && (
                          <i className="bi bi-person-circle me-2"></i>
                        )}
                        <span
                          className={
                            mess.role === "admin"
                              ? styles["chat_me"]
                              : styles["chat_customer"]
                          }
                        >
                          {mess.content}
                        </span>
                      </div>
                    );
                  })}
                <div id={styles.anchor} />
              </div>
            </div>

            <div
              id={styles.chatInput}
              className="row py-2 border-top justify-content-center align-items-center"
            >
              <div className="col col-11 d-flex align-items-center h-75 pe-0">
                <textarea
                  type="text"
                  name="chat-input"
                  placeholder="Enter messages"
                  className="form-control w-100 h-100"
                  ref={messageRef}
                  onKeyDown={onSendMessage}
                />
              </div>
              <a
                href="#"
                onClick={sendMessage}
                className="col col-1 d-flex justify-content-center pe-auto"
              >
                <i className="bi bi-send-fill fs-3"></i>
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4 fs-5">
          <i className="bi bi-x-circle-fill"></i> Session timed out!
          <div>Please log in to see to admin's dashboads.</div>
        </div>
      )}
    </div>
  );
};

export default LiveChat;

export async function loader() {
  // Authentication
  const adminUser = getVariable("adminUser");
  if (!adminUser) {
    return redirect("/auth");
  }
  return null;
}
