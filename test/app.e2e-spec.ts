import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('App e2e', () => {
	let app: INestApplication;
	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();
		app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
		await app.init();
		await app.listen(3333);
		await app.get(PrismaService).cleanDb();
		pactum.request.setBaseUrl('http://localhost:3333');
	});

	afterAll(async () => {
		app.close();
	});

	describe('auth', () => {
		const dto: AuthDto = {
			email: 'user@example.com',
			password: '123',
		};

		const postReq = (route: string, body: object, status: number) =>
			pactum.spec().post(route).withBody(body).expectStatus(status);

		//* SignUp
		describe('Signup', () => {
			const route = '/auth/signup';
			it('should throw if email empty', () =>
				postReq(route, { password: dto.password }, 400));
			it('should throw if password empty', () =>
				postReq(route, { email: dto.email }, 400));
			it('should throw if no body provided', () => postReq(route, {}, 400));
			it('should signup', () => postReq(route, dto, 201));
			it('should throw when signing up with the same email', () => {
				postReq(route, dto, 403); // First sign-up attempt
			});
		});
		//* SignIn
		describe('Signin', () => {
			const route = '/auth/signin';
			it('should throw if email empty', () =>
				postReq(route, { password: dto.password }, 400));
			it('should throw if password empty', () =>
				postReq(route, { email: dto.email }, 400));
			it('should throw if no body provided', () => postReq(route, {}, 400));
			it('should signin', () =>
				postReq(route, dto, 200).stores('userAt', 'access_token'));
		});
	});
	//* User e2e tests
	describe('User', () => {
		describe('Get me', () => {
			const route = '/users/me';
			it('it should get current user', () => {
				return pactum
					.spec()
					.get(route)
					.withBearerToken('$S{userAt}')
					.expectStatus(200);
			});
		});
		describe('Edit User', () => {
			it('Edit user', () => {
				const dto: EditUserDto = {
					firstName: 'Ulrich',
					email: 'ulrich@example.com',
				};
				return pactum
					.spec()
					.patch('/users')
					.withBearerToken('$S{userAt}')
					.withJson(dto)
					.expectStatus(200)
					.expectBodyContains(dto.firstName);
			});
		});
	});
	// * Bookmark e2e tests
	describe('Bookmarks', () => {
		describe('Create bookmarks', () => {});
		describe('Get bookmarks', () => {});
		describe('Get bookmark by ID', () => {});
		describe('Edit bookmark by ID', () => {});
		describe('Delete bookmark', () => {});
	});
});
