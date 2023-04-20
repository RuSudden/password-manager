import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getStorage, ref } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyDsHzkrjcyi_SgfEx7X8Gl0i-n277MHL-4",
  authDomain: "pass-manager-4fc19.firebaseapp.com",
  projectId: "pass-manager-4fc19",
  storageBucket: "pass-manager-4fc19.appspot.com",
  messagingSenderId: "122360482719",
  appId: "1:122360482719:web:ae67be836d538a6c718baa"
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
console.log(storage);

//const ref = storage.ref(`images/${file.name}`)
//ref.put(file)
const ff = ref(storage, '9isZ4slvUA4.jpg');
console.log(ff)
