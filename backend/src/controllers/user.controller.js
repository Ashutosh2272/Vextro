import { User } from "../models/user.model.js";
import httpStatus from "http-status"
import bcrypt, {hash} from "bcrypt"
import crypto from "crypto"

const login  = async(req, res)=>{
    const { username, password } = req.body
    if(!username || !password){
        return res.status(400).json({message:"Please enter username or password!"})
    }
    try {
        const user = await User.findOne({username})
        if(!user){
            return res.status(httpStatus.NOT_FOUND).json({message: "User not found"})
        }
        if(bcrypt.compare(password, user.password)){
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token; 
            await user.save();
            return res.status(httpStatus.OK).json({token: token})
        }else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (error) {
        return res.status(500).json({message: `something went wrong ${error}`})
    }
}


const register = async(req, res) =>{
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message: "User already exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        })
        await newUser.save();
        return res.status(httpStatus.CREATED).json({message: "User registeration successful"})
    } catch (error) {
        return res.json({message: `Something went wrong ${error}`})
    }
}

export {login, register};