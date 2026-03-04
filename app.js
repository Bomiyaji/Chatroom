import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { 
  getDatabase, ref, push, onChildAdded, 
  set, onValue 
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

/* 🔥 FIREBASE CONFIG */
const firebaseConfig={
 apiKey:"AIzaSyCLHlwvG9Cpu5D7ssztKDQEolB4iV-0-FY",
 authDomain:"chatroom5757.firebaseapp.com",
 databaseURL:"https://chatroom5757-default-rtdb.firebaseio.com",
 projectId:"chatroom5757"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

/* 🔥 DATABASE REFS */
const chatRef=ref(db,"romanticChat");
const typingRef=ref(db,"typing");

let username="";

/* =========================
   🔐 JOIN CHAT
========================= */
window.joinChat=function(){

 const name=document.getElementById("username").value.trim();
 const pass=document.getElementById("password").value.trim();

 if(!name){
   alert("Enter your name 💗");
   return;
 }

 if(pass!=="7204"){
   alert("Wrong password 💔");
   return;
 }

 username=name;

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");

 /* System Join Message */
 push(chatRef,{
   name:"System",
   message:`✨ ${username} joined the chat`,
   time:new Date().toLocaleTimeString()
 });

 /* Focus input */
 setTimeout(()=>{
   document.getElementById("msgInput").focus();
 },300);
};


/* =========================
   💌 SEND MESSAGE
========================= */
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


/* =========================
   ✍️ TYPING DETECT
========================= */
const msgInput=document.getElementById("msgInput");

if(msgInput){
 msgInput.addEventListener("input",()=>{
   if(username){
     set(typingRef,{name:username});
   }
 });
}


/* =========================
   👀 SHOW TYPING STATUS
========================= */
onValue(typingRef,(snap)=>{
 const data=snap.val();
 const status=document.getElementById("status");

 if(!status) return;

 if(data && data.name && data.name!==username){
   status.innerText=`💗 ${data.name} is typing...`;
 } else {
   status.innerText="💗 Online";
 }
});


/* =========================
   📥 RECEIVE MESSAGE
========================= */
onChildAdded(chatRef,(data)=>{

 const msg=data.val();
 const messagesBox=document.getElementById("messages");

 if(!messagesBox) return;

 const div=document.createElement("div");

 div.className="msg "+(msg.name===username?"me":"other");

 div.innerHTML=`
 <b>${msg.name}</b><br>
 ${msg.message}
 <div class="time">${msg.time}</div>
 `;

 /* ❤️ DOUBLE TAP HEART */
 div.ondblclick=()=>{
   const heart=document.createElement("div");
   heart.innerText="❤️";
   heart.style.position="absolute";
   heart.style.right="10px";
   heart.style.top="5px";
   heart.style.fontSize="18px";
   heart.style.animation="fade 1s";
   div.appendChild(heart);
   setTimeout(()=>heart.remove(),1000);
 };

 messagesBox.appendChild(div);

 /* 🔊 SOUND FOR OTHER USER */
 if(msg.name!==username){
   const sound=document.getElementById("msgSound");
   if(sound) sound.play().catch(()=>{});
 }

 /* 📜 AUTO SCROLL SMOOTH */
 setTimeout(()=>{
   messagesBox.scrollTop=messagesBox.scrollHeight;
 },100);

});
