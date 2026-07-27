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

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            await AuthService.forgotPassword(email);
            res.status(200).json({ message: "OTP sent successfully to registered email." });
        } catch (error) {
            res.status(error instanceof Error ? 400 : 500)
            .json({ message: error.message });
        }
    }

    async verifyResetOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const resetToken = await AuthService.verifyResetOtp(email, otp);
            res.status(200).json({ resetToken, message: "OTP verified successfully. Proceed to reset password." });
        } catch (error) {
            res.status(error instanceof Error ? 400 : 500)
            .json({ message: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            await AuthService.resetPassword(token, password);
            res.status(200).json({ message: "Password reset successful. You can now log in with your new password." });
        } catch (error) {
            res.status(error instanceof Error ? 400 : 500)
            .json({ message: error.message });
        }
    }
}

module.exports = new AuthController();