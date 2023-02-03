const userModel = require("../models/userModel")
const jwt = require ("jsonwebtoken")
const bcrypt = require("bcrypt")




const register = async (req, res) => {
    try {
        let data = req.body
        let {
            firstname, lastname, username, 
            password, confirmPassword, phone, recoveryEmail, 
            dob, gender
        } = data
        
        if(!firstname){
            return res.status(400).json("Please enter firstname")
        }
        if (!(/^[a-zA-Z]+$/).test(firstname)){
            return res.status(400).json( "first name is invalid")
        }
        if(!lastname){
            return res.status(400).json("Please enter lastname")
        }
        if (!(/^[a-zA-Z]+$/).test(lastname)){
            return res.status(400).json( "last name is invalid")
        }
        if(!username){
            return res.status(400).json("Please enter username")
        }

        //========== validating username ==================
        data.username = username+"@gmail.com";
        let checkUsername = await userModel.findOne({ username : data.username})
        if(checkUsername) return res.status(400).json("This username is already taken")
        
        if(!password){
            return res.status(400).json("Please enter password")
        }
        if(!confirmPassword){
            return res.status(400).json("Please re-enter your password")
        }
        if(password != confirmPassword) return res.status(400).json("password is not matching")

        //========= password regex =====================
        const Passregx = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,}$/;
        let Password = Passregx.test(password);
        if (!Password) {
            return res.status(400).json(
          "Password must have atleast 1 uppercase\n, 1 lowercase, 1 special charecter\n 1 number and must consist atleast 8 charectors.");
        }
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        //================================================
        if(!dob){
            return res.status(400).json("Please enter date of birth")
        }
        
        if (!(/\d{1,2}(\/|-)\d{1,2}(\/|-)\d{2,4}/.test(dob)))
        // regex for dd/mm/yyyy format?
            return res.status(400).json("Why you are even alive?")
        //date of birth regex?
        if(!gender){
            return res.status(400).json("Please select your gender")
        }
        if (!["male", "female", "other"].includes(gender)) {
            return res.status(400).json("gender can be either male, female, or other");
        }
        //========== optional validations ==================
        if(phone){
            if (!(/^[0-9]{10}$/).test(phone)){
                return res.status(400).json( "mobile number is invalid")
            }
            let checkPhone = await userModel.findOne({phone})
            if(checkPhone) return res.status(400).json("Phone number is aldready registered")
        }
        
        if(recoveryEmail){
            let checkMail = await userModel.findOne({username : recoveryEmail})
            if(!checkMail) return res.status(400).json("Recovery email is not available")
        }
        let saveData = await userModel.create(data)
        return res.status(201).json(saveData)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const login = async (req, res) => {
    try {
        let data = req.body
        let { password, body} = data

        let obj = {}
        
        if (!isNaN(body)) {
            obj.phone=body
        }
        else{
            obj.username = body
        }
        if(!password) return res.status(400).json("Please enter password");
        
        let getUser = await userModel.findOne(obj);
        if (!getUser) return res.status(401).json("Email or Password is incorrect.");
    
        let matchPassword = await bcrypt.compare(password, getUser.password);
        if (!matchPassword) return res.status(401).json("Email or Password is incorrect.");
    
        //token
    
        const token = jwt.sign(
        {
            userId: getUser._id.toString(),
        },
            process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
        return res.status(200).json({ getUser, token });
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

const updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let data = req.body
        let {
            firstname, lastname,
            password, confirmPassword, phone, recoveryEmail, 
            dob, gender
        } = data

        if(firstname) {
            if (!(/^[a-zA-Z]+$/).test(firstname)){
                return res.status(400).json( "first name is invalid")
            }
        }
        if(lastname) {
            if (!(/^[a-zA-Z]+$/).test(lastname)){
                return res.status(400).json( "last name is invalid")
            }
        }

        if (password) {
            if(!password){
                return res.status(400).json("Please enter password")
            }
            if(!confirmPassword){
                return res.status(400).json("Please re-enter your password")
            }
            if(password != confirmPassword) return res.status(400).json("password is not matching")
    
            //========= password regex =====================
            const Passregx = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&])[a-zA-Z0-9@#$%&]{8,}$/;
            let Password = Passregx.test(password);
            if (!Password) {
                return res.status(400).json(
              "Password must have atleast 1 uppercase\n, 1 lowercase, 1 special charecter\n 1 number and must consist atleast 8 charectors.");
            }
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        if(gender){
            if (!["male", "female", "other"].includes(gender)) {
                return res.status(400).json("gender can be either male, female, or other");
            }
        }

        if(phone){
            if (!(/^[0-9]{10}$/).test(phone)){
                return res.status(400).json( "mobile number is invalid")
            }
            let checkPhone = await userModel.findOne({phone})
            if(checkPhone) return res.status(400).json("Phone number is aldready registered")
        }

        if(recoveryEmail){
            let checkMail = await userModel.findOne({username : recoveryEmail})
            if(!checkMail) return res.status(400).json("Recovery email is not available")
        }
        let updateData = await userModel.findByIdAndUpdate({ _id: id },{ $set: data },{ new: true })
        return res.status(200).json(updateData)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const deleteUser =async (req, res) => {
    try {
        let id = req.params.id
        await userModel.findByIdAndDelete({_id : id})
        return res.status(200).json("User has been deleted")
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const getUsers = async (req, res) => {
    try {
        let getUsers = await userModel.find({})
        return res.status(200).json(getUsers)
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


module.exports = {register, login, updateUser, deleteUser, getUsers}
