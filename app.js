import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, onValue } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig={
 apiKey:"YOUR_API_KEY",
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

/* JOIN */
window.joinChat=function(){
 const name=document.getElementById("username").value.trim();
 const pass=document.getElementById("password").value;

 if(!name){
   alert("Enter your name");
   return;
 }

 if(pass!=="7204"){
   alert("Wrong password 💔");
   return;
 }

 username=name;

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");

 push(chatRef,{
   name:"System",
   message:`✨ ${username} joined the chat`,
   time:new Date().toLocaleTimeString()
 });
};

/* SEND MESSAGE */
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

/* TYPING */
document.getElementById("msgInput").addEventListener("input",()=>{
 set(typingRef,{name:username});
});

/* SHOW TYPING */
onValue(typingRef,(snap)=>{
 const data=snap.val();
 const status=document.getElementById("status");

 if(data && data.name && data.name!==username){
   status.innerText=`💗 ${data.name} is typing...`;
 } else {
   status.innerText="💗 Online";
 }
});

/* RECEIVE MESSAGE */
onChildAdded(chatRef,(data)=>{
 const msg=data.val();
 const div=document.createElement("div");

 div.className="msg "+(msg.name===username?"me":"other");
 div.innerHTML=`<b>${msg.name}</b><br>${msg.message}<div class="time">${msg.time}</div>`;

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

/* MOOD */
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
