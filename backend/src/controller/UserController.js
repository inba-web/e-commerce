

const getUserProfileByJwt = async (req, res) => {
    try {
        const user = await req.user;
        return res.status(200).json(user);
    } catch (error) {
        handleErrors(err, res);
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
}