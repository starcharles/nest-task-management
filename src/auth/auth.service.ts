import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";
import { JwtService } from "@nestjs/jwt";
import { JwtInterface } from "./jwt.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {
    }

    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        await this.userRepository.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
        const username = await this.userRepository.validatePassword(authCredentialDto);

        const payload: JwtInterface = {
            username,
        }
        const accessToken = this.jwtService.sign(payload);
        return {accessToken};
    }

}
