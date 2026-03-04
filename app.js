import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig={
 apiKey:"AIzaSyCLHlwvG9Cpu5D7ssztKDQEolB4iV-0-FY",
 authDomain:"chatroom5757.firebaseapp.com",
 databaseURL:"https://chatroom5757-default-rtdb.firebaseio.com",
 projectId:"chatroom5757"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

const chatRef=ref(db,"romanticChat");
const typingRef=ref(db,"typing");
const moodRef=ref(db,"moods");

let username="";

window.joinChat=function(){
 const name=document.getElementById("username").value.trim();
 const pass=document.getElementById("password").value;

 if(!name) return alert("Enter your name");
 if(pass!=="7204") return alert("Wrong password 💔");

 username=name;

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");

 push(chatRef,{
   name:"System",
   text:`✨ ${username} joined the chat`,
   timestamp:Date.now()
 });
};

window.sendMessage=function(){
 const input=document.getElementById("msgInput");
 const text=input.value.trim();
 if(!text) return;

 push(chatRef,{
   name:username,
   text:text,
   timestamp:Date.now()
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
   status.innerText=`💗 ${data.name} is typing...`;
 } else {
   status.innerText="💗 Online";
 }
});

onChildAdded(chatRef,(data)=>{
 const msg=data.val();
 const div=document.createElement("div");

 div.className="msg "+(msg.name===username?"me":"other");
 div.innerHTML=`<b>${msg.name}</b><br>${msg.text}
 <div class="time">${new Date(msg.timestamp).toLocaleTimeString()}</div>`;

 div.ondblclick=()=>{
   const heart=document.createElement("div");
   heart.innerText="❤️";
   heart.style.position="absolute";
   heart.style.animation="fade 1s";
   div.appendChild(heart);
   setTimeout(()=>heart.remove(),1000);
 };

 const messages=document.getElementById("messages");
 messages.appendChild(div);
 messages.scrollTop=messages.scrollHeight;
});

window.updateMood=function(){
 const mood=document.getElementById("mood").value;
 set(ref(db,"moods/"+username),{name:username,mood:mood});
};

onValue(moodRef,(snap)=>{
 let text="";
 snap.forEach(child=>{
   const data=child.val();
   text+=`${data.name}: ${data.mood} | `;
 });
 document.getElementById("liveMood").innerText=text;
});
