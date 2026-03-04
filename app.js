import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
getDatabase, ref, push, onChildAdded,
set, onValue, get, child,
onDisconnect
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig={
 apiKey:"YOUR_API_KEY",
 authDomain:"YOUR_AUTH_DOMAIN",
 databaseURL:"YOUR_DATABASE_URL",
 projectId:"YOUR_PROJECT_ID"
};

const app=initializeApp(firebaseConfig);
const db=getDatabase(app);

const chatRef=ref(db,"privateRoom/messages");
const statusRef=ref(db,"privateRoom/status");

let username="";

/* JOIN */
window.joinChat=async function(){

 const name=document.getElementById("username").value;
 const pass=document.getElementById("password").value;

 if(!name) return alert("Enter name");

 const snap=await get(child(ref(db),"settings/roomPassword"));
 const realPass=snap.val();

 if(pass!==realPass){
   alert("Wrong password 💔");
   return;
 }

 username=name;

 document.getElementById("join").style.display="none";
 document.getElementById("chat").classList.remove("hidden");

 const userStatus=ref(db,"privateRoom/status/"+username);
 set(userStatus,{online:true});
 onDisconnect(userStatus).set({online:false});
};

/* SEND MESSAGE */
window.sendMessage=function(){
 const input=document.getElementById("msgInput");
 if(!input.value) return;

 push(chatRef,{
   name:username,
   message:input.value,
   time:new Date().toLocaleTimeString(),
   seen:false
 });

 input.value="";
};

/* RECEIVE MESSAGE */
onChildAdded(chatRef,(data)=>{
 const msg=data.val();
 const div=document.createElement("div");

 div.className="msg "+(msg.name===username?"me":"other");

 div.innerHTML=`
 ${msg.message}
 <div class="time">
 ${msg.time} ${msg.name===username?(msg.seen?"✔✔":"✔"):""}
 </div>
 `;

 if(msg.name!==username){
   set(ref(db,"privateRoom/messages/"+data.key+"/seen"),true);
 }

 div.oncontextmenu=(e)=>{
   e.preventDefault();
   if(msg.name===username){
     if(confirm("Delete this message?")){
       set(ref(db,"privateRoom/messages/"+data.key),null);
       div.remove();
     }
   }
 };

 document.getElementById("messages").appendChild(div);

 setTimeout(()=>{
   const box=document.getElementById("messages");
   box.scrollTop=box.scrollHeight;
 },100);
});

/* ONLINE STATUS */
onValue(statusRef,(snap)=>{
 let online=0;
 snap.forEach(c=>{
   if(c.val().online) online++;
 });
 document.getElementById("status").innerText=
 online>1?"💗 Both Online":"💔 Waiting...";
});
