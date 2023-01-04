import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from "./firebase.js";

async function getItems() {
  const querySnapshot = await getDocs(collection(db, "todo-items"));
  let items = [];
  querySnapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  generateItems(items);
}

function generateItems(items) {
  let todoItems = [];
  items.forEach((item) => {
    let todoItem = document.createElement("div");
    todoItem.classList.add("todo-item");
    let checkContainer = document.createElement("div");
    checkContainer.classList.add("check");
    let checkMark = document.createElement("div");
    checkMark.classList.add("check-mark");
    checkMark.innerHTML = '<img src="images/icon-check.svg">';
    checkMark.addEventListener("click", function () {
      markCompleted(item.id);
      getItems()
    });
    checkContainer.appendChild(checkMark);

    let todoText = document.createElement("div");
    todoText.classList.add("todo-text");
    todoText.innerText = item.text;

    if (item.status == "completed") {
      checkMark.classList.add("checked");
      todoText.classList.add("checked");
    }
    todoItem.appendChild(checkContainer);
    todoItem.appendChild(todoText);
    todoItems.push(todoItem);
  });
  document.querySelector(".todo-items").replaceChildren(...todoItems);
}

async function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  try {
    const docRef = await addDoc(collection(db, "todo-items"), {
      text: text.value,
      status: "active",
    });
    console.log("Document written with ID: ", docRef.id);
    text.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function markCompleted(id) {
    console.log("<<<<<<")
  const docRef = doc(db, "todo-items", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists) {
    if (docSnap.data().status == "active") {
      updateDoc(docRef, "status", "completed");
    } else {
      updateDoc(docRef, "status", "active");
    }
  }
}

getItems();

document.getElementById("form").addEventListener("submit", (event) => {
  addItem(event);
  getItems();
});
