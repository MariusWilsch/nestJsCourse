import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	ForbiddenException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
		switch (exception.code) {
			case 'P2002':
				throw new ForbiddenException('Credentials taken');
			default:
				throw exception;
		}
	}
}
