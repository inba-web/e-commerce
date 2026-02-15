const UserRoles = require("../domain/UserRole");
const AuthService = require("../service/AuthService");

class AuthController{
    async sendLoginOTP(req, res){
        try {
            const email = req.body.email;
            await AuthService.sendLoginOTP(email);

            res.status(200).json({message:"OTP sent successfully"})
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
            .json({message: error.message})
        }
    }

    async createUser(req, res){
        try {
            const jwt = await AuthService.createUser(req.body);

            const authResponse = {
                jwt,
                message: "User created successfullyy",
                role: UserRoles.CUSTOMER
            }

            res.status(200).json(authResponse);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
            .json({message: error.message})
        }
    }

    async signin(req, res){
        try {
            const authResponse = await AuthService.signin(req.body);

            res.status(200).json(authResponse);
        } catch (error) {
            res.status(error instanceof Error ? 404 : 500)
            .json({message: error.message})
        }
    }
}

module.exports = new AuthController();