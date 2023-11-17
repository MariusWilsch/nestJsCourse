import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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

		//! If the yt course does not show a way to remmove the
		// !try/catch and centralise the exeception handling then I will search for a way later on
		try {
			const user = await this.prisma.user.create({
				data: {
					email: dto.email,
					hash,
				},
			});

			delete user.hash;

			return user;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002')
					throw new ForbiddenException('Credentials taken');
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		});
		if (!user) throw new ForbiddenException('Credentials incorrect');

		const pwMatches = await argon.verify(user.hash, dto.password);

		if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

		delete user.hash;

		return user;
	}
}
