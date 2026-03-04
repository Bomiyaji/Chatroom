import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded }
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig={
 apiKey:"AIzaSyCLHlwvG9Cpu5D7ssztKDQEolB4iV-0-FY",
 authDomain:"chatroom5757.firebaseapp.com",
 databaseURL:"https://chatroom5757-default-rtdb.firebaseio.com",
 projectId:"chatroom5757"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

const chatRef=ref(db,"romanticChat");

let username="";

window.joinChat=function(){
 username=document.getElementById("username").value;
 if(!username) return alert("Enter name");

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");
};

window.sendMessage=function(){

const input=document.getElementById("msgInput");
if(!input.value) return;

push(chatRef,{
 name:username,
 message:input.value,
 time:new Date().toLocaleTimeString()
});

input.value="";
};

onChildAdded(chatRef,(data)=>{

const msg=data.val();

const div=document.createElement("div");
div.className="msg "+(msg.name===username?"me":"other");

div.innerHTML=
`<b>${msg.name}</b><br>
${msg.message}
<div class="time">${msg.time}</div>`;

document.getElementById("messages").appendChild(div);

document.getElementById("messages").scrollTop=
document.getElementById("messages").scrollHeight;
});
