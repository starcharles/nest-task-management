import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from "./user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { User } from "./user.entity";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
    }

    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        await this.userRepository.signup(authCredentialDto);
    }

    async signin(authCredentialDto: AuthCredentialDto): Promise<string> {
        const result = await this.userRepository.validatePassword(authCredentialDto);
        return result;
    }

}
