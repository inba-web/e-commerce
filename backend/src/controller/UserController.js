

const getUserProfileByJwt = async (req, res) => {
    try {
        const user = await req.user;
        return res.status(200).json(user);
    } catch (error) {
        handleErrors(error, res);
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const user = await req.user;
        const { fullName, mobile } = req.body;
        
        if (fullName) user.fullName = fullName;
        if (mobile) user.mobile = mobile;
        
        await user.save();
        const updatedUser = await user.populate("addresses");
        return res.status(200).json(updatedUser);
    } catch (error) {
        handleErrors(error, res);
    }
}

const addUserAddress = async (req, res) => {
    try {
        const user = await req.user;
        const Address = require("../model/Address");
        
        const newAddress = new Address({
            name: req.body.name,
            locality: req.body.locality,
            pincode: req.body.pinCode || req.body.pincode,
            pinCode: req.body.pinCode || req.body.pincode,
            statue: req.body.state || req.body.statue,
            state: req.body.state || req.body.statue,
            address: req.body.streetAddress || req.body.address,
            streetAddress: req.body.streetAddress || req.body.address,
            city: req.body.city,
            mobile: req.body.mobile
        });
        
        const savedAddress = await newAddress.save();
        user.addresses.push(savedAddress._id);
        await user.save();
        
        const updatedUser = await user.populate("addresses");
        return res.status(200).json(updatedUser);
    } catch (error) {
        handleErrors(error, res);
    }
}

const updateUserAddress = async (req, res) => {
    try {
        const user = await req.user;
        const { addressId } = req.params;
        const Address = require("../model/Address");
        
        if (!user.addresses.includes(addressId)) {
            return res.status(403).json({ message: "Unauthorized to update this address" });
        }
        
        await Address.findByIdAndUpdate(addressId, {
            name: req.body.name,
            locality: req.body.locality,
            pincode: req.body.pinCode || req.body.pincode,
            pinCode: req.body.pinCode || req.body.pincode,
            statue: req.body.state || req.body.statue,
            state: req.body.state || req.body.statue,
            address: req.body.streetAddress || req.body.address,
            streetAddress: req.body.streetAddress || req.body.address,
            city: req.body.city,
            mobile: req.body.mobile
        }, { new: true });
        
        const updatedUser = await user.populate("addresses");
        return res.status(200).json(updatedUser);
    } catch (error) {
        handleErrors(error, res);
    }
}

const deleteUserAddress = async (req, res) => {
    try {
        const user = await req.user;
        const { addressId } = req.params;
        const Address = require("../model/Address");
        
        user.addresses = user.addresses.filter(id => id.toString() !== addressId);
        await user.save();
        
        await Address.findByIdAndDelete(addressId);
        
        const updatedUser = await user.populate("addresses");
        return res.status(200).json(updatedUser);
    } catch (error) {
        handleErrors(error, res);
    }
}

const handleErrors = (err, res) => {
    if(err instanceof Error){
        return res.status(404).json({message : err.message})
    }
    return res.status(500).json({message : "Internal Server Error"})
}

module.exports = {
    getUserProfileByJwt,
    updateUserProfile,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,
    handleErrors
}