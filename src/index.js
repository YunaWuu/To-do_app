import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { db } from "./firebase.js";

var localItems = []

const collectionName = "todo-items"

async function getItems() {
  const querySnapshot = await getDocs(collection(db, collectionName));
  let items = [];
  querySnapshot.forEach((doc) => {
    items.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  // Sort the to do items in descending order
  items.sort(function(x, y){
    return y.createdAt - x.createdAt;
  })

  generateItems(items);
  localItems = items;
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
    checkMark.addEventListener("click", async function () {
      await markCompleted(item.id);
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
  let activeItems = getActiveItem(items);
  console.log(activeItems)
  document.querySelector(".items-left").innerHTML = activeItems.length + " items left";
}

async function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      text: text.value,
      status: "active",
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    text.value = "";
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

async function markCompleted(id) {
  const docRef = doc(db, collectionName, id);
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

document.getElementById("form").addEventListener("submit", async (event) => {
  await addItem(event);
  getItems();
});

document.getElementById("all-items").addEventListener("click", (event) => {
    getItems();
})

function getActiveItem(items) {
    let activeItems = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].status == "active") {
            activeItems.push(items[i]);
        }
    }
    return activeItems;
}

document.getElementById("active").addEventListener("click", (event) => {
    let activeItems = getActiveItem(localItems);
    generateItems(activeItems);
})

function getCompletedItem() {
    let completedItems = [];
    for (let i = 0; i < localItems.length; i++) {
        if (localItems[i].status == "completed") {
            completedItems.push(localItems[i]);
        }
    }
    generateItems(completedItems)
}

document.getElementById("completed").addEventListener("click", (event) => {
    getCompletedItem()
});

document.getElementById("clear-completed").addEventListener("click", async (event) => {
    for (let i =0; i < localItems.length; i++) {
        if (localItems[i].status == "completed") {
            await deleteDoc(doc(db, collectionName, localItems[i].id))
        }
    }
    getItems(localItems); 
})