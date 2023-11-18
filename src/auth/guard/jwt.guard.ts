import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwtAuth') {
	constructor() {
		super();
	}
}
