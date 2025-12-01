import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    // POST auth/signup
    @Post("signup")
    signup(@Body() dto: CreateUserDto) {
        return this.authService.signup(dto);
    }

    // POST auth/signin
    @Post("signin")
    signin(@Body() dto: LoginUserDto) {
        return this.authService.signin(dto);
    }
}
