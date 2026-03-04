import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
 apiKey:"YOUR_API_KEY",
 authDomain:"chatroom5757.firebaseapp.com",
 databaseURL:"https://chatroom5757-default-rtdb.firebaseio.com",
 projectId:"chatroom5757"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const chatRef = ref(db,"romanticChat");
const typingRef = ref(db,"typing");

let username="";

window.joinChat=function(){
 const name=document.getElementById("username").value.trim();
 const pass=document.getElementById("password").value;

 if(!name) return alert("Enter name");
 if(pass!=="7204") return alert("Wrong password");

 username=name;

 document.getElementById("joinScreen").classList.add("hidden");
 document.getElementById("chatScreen").classList.remove("hidden");
};

window.sendMessage=function(){
 const input=document.getElementById("msgInput");
 const text=input.value.trim();
 if(!text) return;

 push(chatRef,{
  name:username,
  message:text,
  time:new Date().toLocaleTimeString()
 });

 set(typingRef,{name:""});
 input.value="";
};

document.getElementById("msgInput").addEventListener("input",()=>{
 set(typingRef,{name:username});
});

onValue(typingRef,(snap)=>{
 const data=snap.val();
 const status=document.getElementById("status");

 if(data && data.name && data.name!==username){
  status.innerText=data.name+" typing...";
 }else{
  status.innerText="Online";
 }
});

onChildAdded(chatRef,(data)=>{
 const msg=data.val();

 const div=document.createElement("div");
 div.className="message "+(msg.name===username?"me":"other");
 div.innerHTML=`${msg.message}<div class="time">${msg.time}</div>`;

 const container=document.getElementById("messages");
 container.appendChild(div);
 container.scrollTop=container.scrollHeight;
});
