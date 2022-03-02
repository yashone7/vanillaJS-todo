import axios from "axios";
import { v4 } from "uuid";

const form = document.querySelector("#my-form");
const item = document.getElementById("item");
const list = document.querySelector("ul");
let deleteBtns = [];

const myBtn = document.getElementById("my-test");

const postEvent = new CustomEvent("todo-post");
const deleteEvent = new CustomEvent("todo-delete");

let todoList = [];

window.addEventListener("load", async (e) => {
  const data = await fetchTodos();
  todoList = data;
  renderTodos(todoList);
  deleteBtns = Array.from(
    document.querySelectorAll('[data-button-type="delete"]')
  );
});

window.addEventListener("todo-post", async (e) => {
  console.log("todo posted");
  const data = await fetchTodos();
  todoList = data;
  renderTodos(todoList);
});

window.addEventListener("todo-delete", async (e) => {
  console.log("todo deleted");
  const data = await fetchTodos();
  todoList = data;
  renderTodos(todoList);
});

/**
 *  we have our mock json server
 * after clicking submit -> data should be posted to server as well as it should be
 * displayed on the list
 *
 */

// axios, fetch - for api calls

// need to model how to send the data to server

// whenever we are creating a new to do a new object should be created and this should
// be pushed to the list of existing todos.

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let value = item.value;
  const uuid = v4();
  let obj = Object.assign({}, { id: uuid, title: value, author: "yashone7" });
  const data = JSON.stringify(obj);
  try {
    await postTodos(data);
    window.dispatchEvent(postEvent);
  } catch (error) {
    console.log(error);
  }
});

async function postTodos(todo) {
  await axios({
    method: "POST",
    data: todo,
    headers: {
      "Content-Type": "application/json",
    },
    url: "http://localhost:3000/todos",
  });
}

async function fetchTodos() {
  const { data } = await axios.get("http://localhost:3000/todos");
  return data;
}

function renderTodos(data) {
  data.forEach((el) => {
    const li = document.createElement("li");
    li.classList.add("is-flex");
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.id = el.id;
    deleteBtn.dataset.buttonType = "delete";
    li.innerText = el.title;
    deleteBtn.textContent = "delete";
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

list.addEventListener("click", async (e) => {
  if (e.target.dataset.buttonType === "delete") {
    await deleteTodos(e.target.id);
    const li = e.target.parentElement;
    console.log(li);
    list.removeChild(li);
  }
});

async function deleteTodos(id) {
  console.log(id);
  await axios({
    method: "DELETE",
    url: `http://localhost:3000/todos/${id}`,
  });
  window.dispatchEvent(deleteEvent);
  //   console.log(todoList);
}

// deleting the to dos is simply filtering the list fo available ids and comparing
// with the main list and id !== current iteration id
