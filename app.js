const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editID = "";

form.addEventListener("submit", addItem);
container.addEventListener("click", handleItemClick);
window.addEventListener("DOMContentLoaded", setupItems);
clearBtn.addEventListener("click", clearItems);

function addItem(e) {
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();

    if (value.trim() !== "") {
        if (!editFlag) {
            createListItem(id, value);
            displayAlert("Item added to the list", "success");
            addToLocalStorage(id, value);
        } else {
            editElement.textContent = value;
            displayAlert("Value changed", "success");
            editLocalStorage(editID, value);
            setBackToDefault();
        }
        setBackToDefault();
    } else {
        displayAlert("Please enter a value", "danger");
    }
}

function handleItemClick(e) {
    const target = e.target;
    if (target.classList.contains("delete-btn")) {
        const element = target.closest(".grocery-item");
        const id = element.dataset.id;
        list.removeChild(element);
        removeFromLocalStorage(id);
        displayAlert("Item removed", "danger");
        if (list.children.length === 0) {
            container.classList.remove("show-container");
        }
        setBackToDefault();
    } else if (target.classList.contains("edit-btn")) {
        const element = target.closest(".grocery-item");
        editElement = element.querySelector(".title");
        grocery.value = editElement.textContent;
        editFlag = true;
        editID = element.dataset.id;
        submitBtn.textContent = "Edit";
    }
}

function clearItems() {
    list.innerHTML = "";
    container.classList.remove("show-container");
    displayAlert("Empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Submit";
}

function createListItem(id, value) {
    const element = document.createElement("article");
    element.setAttribute("data-id", id);
    element.classList.add("grocery-item");
    element.innerHTML = `<p class="title">${value}</p>
          <div class="btn-container">
            <button type="button" class="edit-btn"><i class="fas fa-edit"></i></button>
            <button type="button" class="delete-btn"><i class="fas fa-trash"></i></button>
          </div>`;
    list.appendChild(element);
}

function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);
    setTimeout(() => {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 1000);
}

function addToLocalStorage(id, value) {
    const items = getLocalStorage();
    items.push({ id, value });
    localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(item => item.id !== id);
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(item => (item.id === id ? { ...item, value } : item));
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("list")) || [];
}

function setupItems() {
    const items = getLocalStorage();
    if (items.length > 0) {
        items.forEach(item => createListItem(item.id, item.value));
        container.classList.add("show-container");
    }
}
