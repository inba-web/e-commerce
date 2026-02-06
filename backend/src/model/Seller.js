const { default: mongoose } = require("mongoose");
const UserRoles = require("../../domain/UserRole");
const AccountStatus = require("../../domain/AccountStatus");


const sellerSchema = new mongoose.Schema({
    sellerName:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    businessDetails:{
        businessName: {
            type:String,
        },
        businessEmail:{
            type:String,
        },
        businessMobile:{
            type:String,
        },
        businessAddress:{
            type:String,
        },
    },
    bankDetails:{
        accountNumber:{
            type:String,
        },
        accountHolderName:{
            type:String,
        },
        bankName:{
            type:String,
        },
        ifscCode:{
            type:String,
        }
    },
    pickupAddress:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
    },
    GSTIN:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:[UserRoles.SELLER],
        default: UserRoles.SELLER
    },
    accountStatus:{
        type:String,
        enum:[AccountStatus.PENDING_VERIFICATION,
            AccountStatus.ACTIVE,
            AccountStatus.BANNER,
            AccountStatus.CLOSED,
            AccountStatus.DEACTIVATED,
            AccountStatus.SUSPENDED,
        ],
        default: AccountStatus.PENDING_VERIFICATION
    }

},{timestamps:true})

module.exports = mongoose.model("Seller", sellerSchema);