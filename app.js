import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, set, onValue, onDisconnect } 
from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig={
 apiKey:"YOUR_API_KEY",
 authDomain:"YOUR_AUTH_DOMAIN",
 databaseURL:"YOUR_DATABASE_URL",
 projectId:"YOUR_PROJECT_ID"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

const chatRef=ref(db,"romanticChat");
const moodRef=ref(db,"moods");
const onlineRef=ref(db,"onlineUsers");

let username="";

let wrongAttempts = Number(localStorage.getItem("wrongAttempts")) || 0;
let lockUntil = Number(localStorage.getItem("lockUntil")) || 0;

/* JOIN */
window.joinChat=function(){

 const name=document.getElementById("username").value.trim();
 const pass=document.getElementById("password").value.trim();
 const now=Date.now();

 if(now < lockUntil){
   const sec=Math.ceil((lockUntil-now)/1000);
   alert("Blocked. Try again in "+sec+" seconds");
   return;
 }

 if(!name){
   alert("Enter your name");
   return;
 }

 if(pass!=="7204"){
   wrongAttempts++;
   localStorage.setItem("wrongAttempts",wrongAttempts);

   if(wrongAttempts>=10){
     lockUntil=Date.now()+5*60*1000;
     localStorage.setItem("lockUntil",lockUntil);
     localStorage.setItem("wrongAttempts",0);
     wrongAttempts=0;
     alert("Blocked for 5 minutes");
     return;
   }

   alert("Wrong password ("+wrongAttempts+"/10)");
   return;
 }

 localStorage.removeItem("wrongAttempts");
 localStorage.removeItem("lockUntil");

 username=name;

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");

 const userOnlineRef=ref(db,"onlineUsers/"+username);
 set(userOnlineRef,true);
 onDisconnect(userOnlineRef).remove();
};

/* ONLINE COUNT */
onValue(onlineRef,(snap)=>{
 const count=snap.exists()?Object.keys(snap.val()).length:0;
 document.getElementById("status").innerText="🟢 Online: "+count;
});

/* SEND */
window.sendMessage=function(){
 const input=document.getElementById("msgInput");
 const text=input.value.trim();
 if(!text) return;

 push(chatRef,{
   name:username,
   message:text,
   time:new Date().toLocaleTimeString()
 });

 input.value="";
};

/* RECEIVE */
onChildAdded(chatRef,(data)=>{
 const msg=data.val();
 const div=document.createElement("div");
 div.className="msg "+(msg.name===username?"me":"other");

 const nameEl=document.createElement("b");
 nameEl.textContent=msg.name;

 const br=document.createElement("br");

 const text=document.createElement("span");
 text.textContent=msg.message;

 const time=document.createElement("div");
 time.className="time";
 time.textContent=msg.time;

 div.appendChild(nameEl);
 div.appendChild(br);
 div.appendChild(text);
 div.appendChild(time);

 // Emoji reactions
 const reactBox=document.createElement("div");
 reactBox.style.marginTop="5px";

 ["❤️","😂","😮","🔥"].forEach(e=>{
   const span=document.createElement("span");
   span.innerText=e;
   span.style.cursor="pointer";
   span.style.marginRight="5px";
   span.onclick=()=>{
     const r=document.createElement("span");
     r.innerText=e;
     r.style.marginLeft="5px";
     div.appendChild(r);
   };
   reactBox.appendChild(span);
 });

 div.appendChild(reactBox);

 document.getElementById("messages").appendChild(div);
 document.getElementById("messages").scrollTop=
 document.getElementById("messages").scrollHeight;
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
   text+=data.name+" "+data.mood+" | ";
 });
 document.getElementById("liveMood").innerText=text;
});
