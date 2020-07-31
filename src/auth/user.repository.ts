import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException, NotFoundException, UnauthorizedException
} from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signup(authCredentialDto: AuthCredentialDto): Promise<void> {
        const {username, password} = authCredentialDto;
        const user = new User();
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        user.username = username;
        user.salt = salt;
        user.password = hash;

        try {
            await user.save();

        } catch (err) {
            if(err.code === '23505') { // duplicate error code
                throw new ConflictException(`username already exists`);
            }
            throw new InternalServerErrorException(`signup failed`);
        }
    }

    async validatePassword(authCredentialDto: AuthCredentialDto): Promise<string> {
        const {username, password} = authCredentialDto;
        const user = await User.findOne({username});
        if(user && await user.validatePassword(password)) {
            return user.username;
        }
        throw new UnauthorizedException('Invalid Credentials');
    }
}
