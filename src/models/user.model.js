import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String,  //cloudinary url
            required: true,
        },
        coverImage:{
            type: String,  //cloudinary url
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken:{
            type: String
        }

    },
    {
        timestamps: true
    }
    
)

// while saving data in db it will run automatically.
userSchema.pre("save", async function (next) { 
    if(!this.isModified("password")) return next(); // if password not modified don't run this function and return from here
    this.password = bcrypt.hash(this.password, 10)
    next()
})


//custom method defining
userSchema.methods.isPassword.Correct = async function(password){
    return await (bcrypt.compare(password, this.password))
}

userSchema.methods.generateAccessToken = function(){
        jwt.sign({
            _id: this._id,
            username: this.username,
            fullName: this.fullName,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign({
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRY
        }
    )
}



export const User = mongoose.model("User",userSchema);