const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const dbconnect= async () =>{
    try{
        mongoose.connect(process.env.MONGO_URI);
        console.log("Database Connected!");
    }catch(err){
        console.log("Error connecting Database", err);
    }
}
dbconnect();

//Schema
const itemSchema = new mongoose.Schema({
    todo: String,
    priority: String
});
const Item = mongoose.model("Item", itemSchema);

app.get("/", async (req, res) => {
    try {
        const items = await Item.find({});
        res.render("list", { ejes: items });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Error loading todos");
    }
});


app.post("/", async (req, res) => {
    try {
        const todoText = req.body.todo?.trim();
        
        if (!todoText) {
            console.log("Empty task, not adding to DB"); 
            return res.redirect("/");
        }

        const newItem = new Item({ todo: todoText, priority: req.body.priority });
        await newItem.save();
        
        console.log("Task added:", newItem);
        res.redirect("/");
    } catch (err) {
        console.error("Error adding item:", err);
        res.status(500).send("Error adding todo");
    }
});


app.post("/modify", async (req, res) => {
    console.log("Received Form Data:", req.body);

    const { itemId, updatedTodo, priority, action } = req.body;

    if (!action) {
        console.error("No action received!");
        return res.status(400).send("Action is missing.");
    }

    if (!itemId) {
        console.error("No valid itemId received!");
        return res.status(400).send("Item ID is required.");
    }

    try {
        if (action === "update") {
            if (!updatedTodo.trim()) {
                console.log("Empty update, ignoring...");
                return res.redirect("/");
            }

            const updatedItem = await Item.findByIdAndUpdate(itemId, { todo: updatedTodo.trim(), priority }, { new: true });
            console.log("Task updated:", updatedItem);
        } else if (action === "delete") {
            await Item.findByIdAndDelete(itemId);
            console.log("Item deleted:", itemId);
        }

        res.redirect("/");
    } catch (error) {
        console.error("Error modifying item:", error);
        res.status(500).send("Failed to modify item.");
    }
});

app.listen(8000, function(){
    console.log("Server running on port 8000");
});