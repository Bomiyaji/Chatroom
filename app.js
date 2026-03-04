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

const chatRef=ref(db,"studyChat");
let username="";

/* JOIN */
window.joinChat=function(){
 const name=document.getElementById("username").value;
 const pass=document.getElementById("password").value;

 if(pass!=="7204"){alert("Wrong password");return;}
 username=name;
 document.getElementById("join").style.display="none";
 document.getElementById("app").classList.remove("hidden");

 /* join animation message */
 push(chatRef,{
   name:"System",
   message:`✨ ${username} joined the chat`,
   time:new Date().toLocaleTimeString()
 });
};

/* CHAT FUNCTIONS */
window.sendMessage=function(){
 const input=document.getElementById("msgInput");
 if(!input.value) return;

 push(chatRef,{name:username,message:input.value,time:new Date().toLocaleTimeString()});
 input.value="";
};

/* RECEIVE MESSAGE */
onChildAdded(chatRef,(data)=>{
 const msg=data.val();
 const div=document.createElement("div");
 div.className="msg "+(msg.name===username?"me":"other");
 div.innerHTML=`<b>${msg.name}</b><br>${msg.message}<div class="time">${msg.time}</div>`;
 document.getElementById("messages").appendChild(div);
 messages.scrollTop=messages.scrollHeight;
});

/* TAB FUNCTION */
window.showTab=function(tabName){
  document.querySelectorAll(".tabContent").forEach(tab=>tab.classList.add("hidden"));
  document.getElementById(tabName).classList.remove("hidden");
}

/* Flashcards skeleton */
const flashcards=[
  {q:"What is the capital of India?","a":"New Delhi"},
  {q:"Newton's second law?","a":"F = ma"},
  {q:"Define Photosynthesis","a":"Process of converting sunlight to energy in plants"}
];
let fcIndex=0;
window.nextFlashcard=function(){
  const card=flashcards[fcIndex];
  document.getElementById("flashQuestion").innerText=`Q: ${card.q}\nA: ${card.a}`;
  fcIndex=(fcIndex+1)%flashcards.length;
}
