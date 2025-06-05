function setAction(actionType, formElement) {
    const actionField = formElement.querySelector("[name='action']");
    actionField.value = actionType; 
    console.log("🛠️ Setting action:", actionField.value);
    formElement.submit(); 
}

function validateForm() {
        const todoText = document.getElementById("ele1").value.trim();
        if (!todoText) {
            alert("Please enter a task to add");
            return false; 
        }
    }


document.querySelectorAll(".filter a").forEach(filterLink => {
    filterLink.addEventListener("click", function (event) {
        event.preventDefault();
        let priority = this.innerText.toLowerCase();
        
        document.querySelectorAll("li").forEach(li => {
            let itemPriority = li.querySelector(".priority").value.toLowerCase();
            li.style.display = priority === "all" || itemPriority.includes(priority) ? "block" : "none";
        });
    });
});

