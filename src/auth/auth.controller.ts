import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @Post('signup')
    async signup(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto): Promise<void> {
       console.log(authCredentialDto);
       await this.authService.signup(authCredentialDto);
    }

    @Post('signin')
    async signin(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
        await this.authService.signin(authCredentialDto);
    }
}
