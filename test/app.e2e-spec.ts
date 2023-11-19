import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { EditBookmarkDto } from 'src/bookmark/dto';

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

	const postReq = (route: string, body: object, status: number) =>
		pactum.spec().post(route).withBody(body).expectStatus(status);

	describe('auth', () => {
		const dto: AuthDto = {
			email: 'user@example.com',
			password: '123',
		};

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
		const route = '/bookmarks';
		describe('Get empty bookmarks', () => {
			it('should return empty array when no bookmarks are created', () => {
				return pactum
					.spec()
					.get(route)
					.withBearerToken('$S{userAt}')
					.expectStatus(200)
					.expectJson([]);
			});
		});
		describe('Create bookmarks', () => {
			it('should create bookmark', () => {
				const dto = {
					title: 'Google',
					link: 'https://google.com',
					description: 'Search engine for the web',
				};
				return pactum
					.spec()
					.post(route)
					.withBearerToken('$S{userAt}')
					.withJson(dto)
					.expectStatus(201)
					.expectJsonMatch({
						...dto,
					})
					.stores('bookmarkId', 'id');
			});
		});
		describe('Get bookmarks', () => {
			it('Get all bookmarks', () => {
				return pactum
					.spec()
					.get(route)
					.withBearerToken('$S{userAt}')
					.expectStatus(200)
					.expectJsonLength(1);
			});
		});
		describe('Get bookmark by ID', () => {
			it('Get bookmark by ID', () => {
				return pactum
					.spec()
					.get(route + '/$S{bookmarkId}')
					.withBearerToken('$S{userAt}')
					.expectStatus(200)
					.expectJsonMatch({
						id: '$S{bookmarkId}',
					});
			});
		});
		describe('Edit bookmark by ID', () => {
			const dto: EditBookmarkDto = {
				description: 'New description',
			};
			it('Edit description in bookmark', () => {
				return pactum
					.spec()
					.patch(route + '/$S{bookmarkId}')
					.withJson(dto)
					.withBearerToken('$S{userAt}')
					.expectStatus(200)
					.expectJsonLike(dto);
			});
		});
		describe('Delete bookmark', () => {
			it('Delete bookmark', () => {
				return pactum
					.spec()
					.delete(route + '/$S{bookmarkId}')
					.withBearerToken('$S{userAt}')
					.expectStatus(204);
			});
			it('Should get empty bookmarks', () => {
				return pactum
					.spec()
					.get(route)
					.withBearerToken('$S{userAt}')
					.expectStatus(200)
					.expectJson([]);
			});
		});
	});
});
