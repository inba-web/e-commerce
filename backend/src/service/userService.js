const User = require("../model/User");
const jwtProvider = require("../utils/jwtProvider");


class UserService {

    async findUserProfileByJwt(jwt){
        const email = jwtProvider.getEmailFromjwt(jwt);

        const user = await User.findOne({email});

        if(!user){
            throw new UserError(`User does not exists with this email ${email}`)
        }
        return user;
    }

    async findUserByEmail(email) {
        const user = await User.findOne({email});

        if(!user) {
            throw new UserException(`User does not exists with this email ${email}`);
        }
        return user;
    }
}

module.exports = new UserService();