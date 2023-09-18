const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { route } = require("express/lib/router");
const { Schema } = mongoose;
const { Types } = Schema;

const UsersSchema = new Schema({
    name: {
        type: Types.String,
        require: true,
        trim: true
    },
    surname: {
        type: Types.String,
        require: true,
        trim: true
    },
    email: {
        type: Types.String,
        trim: true,
        unique: true,
        require: true
    },
    password: {
        type: Types.String,
        require: true
    },
    photoUrl: {
        type: Types.String,
        trim: true,
        default: null
    }
}, {
    _id: true,
    timestamps: true,
    collation: "users",
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

UsersSchema.pre('save', async function preSave(next) {
    if (this.isNew) {
        try {
            console.log("Password converting into hash");
            this.password = await bcrypt.hash(this.password, 10);
            return next();
        } catch (err) {
            return next(err);
        }
    }
    next();
})

const Users = mongoose.model("Users", UsersSchema);
module.exports = Users;