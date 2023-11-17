import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	/**
	 * Creates a new user with the provided email and password hash.
	 * @param dto - The authentication data transfer object.
	 * @returns The newly created user.
	 */
	async signup(dto: AuthDto) {
		const hash = await argon.hash(dto.password);

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash,
			},
		});

		delete user.hash;

		return user;
	}
	signin() {
		return 'test';
	}
}
