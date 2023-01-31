const express = require('express')
const route = express.Router()
const userController = require("./controllers/userController")

route.get("/", (req,res) => {
    return res.json("Api is Working !")
})

//================= USER API ==================
route.post("/user/register", userController.register)
route.post("/user/login", userController.login)
route.put("/user/update/:id", userController.updateUser)
route.delete("/user/delete/:id", userController.deleteUser)

route.get("/users", userController.getUsers)

module.exports = route