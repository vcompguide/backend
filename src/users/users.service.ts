import { User, UserDocument } from '@libs/coredb/schemas/user.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto';
import { UserResponse } from './response';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name, 'core')
        private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserResponse> {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        return new UserResponse({
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            avatarUrl: savedUser?.avatarUrl,
            description: savedUser?.description,
        });
    }

    async findAll(): Promise<UserResponse[]> {
        const users = await this.userModel.find({});
        return users.map(
            (user) =>
                new UserResponse({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatarUrl: user?.avatarUrl,
                    description: user?.description,
                }),
        );
    }

    async findOneByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).select('+password').exec();
    }

    async findOneById(id: string): Promise<UserResponse> {
        const user = await this.userModel.findById(id).exec();

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return new UserResponse({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user?.avatarUrl,
            description: user?.description,
        });
    }
}
