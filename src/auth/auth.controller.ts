import { Body, Controller, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
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
    async signin(@Body() authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        return await this.authService.signin(authCredentialDto);
    }

    @Post('test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log(user);
    }

}
