import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
getDatabase,
ref,
push,
onChildAdded
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "chatroom5757.firebaseapp.com",
databaseURL:"https://chatroom5757-default-rtdb.firebaseio.com",
projectId: "chatroom5757",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username="";
const chatRef = ref(db,"liveChat");

window.joinChat=function(){

username=document.getElementById("username").value;

if(!username) return alert("Enter name");

document.getElementById("joinScreen").style.display="none";
document.getElementById("chatScreen").classList.remove("hidden");
};

window.sendMessage=function(){

const text=document.getElementById("msgInput").value;
if(text==="") return;

push(chatRef,{
name:username,
message:text
});

document.getElementById("msgInput").value="";
};

onChildAdded(chatRef,(data)=>{

const msg=data.val();

const div=document.createElement("div");
div.className="msg "+(msg.name===username?"me":"other");

div.innerText=msg.name+": "+msg.message;

document.getElementById("messages").appendChild(div);

document.getElementById("messages").scrollTop=
document.getElementById("messages").scrollHeight;

});
