import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
// import { PrismaExceptionFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);
	// app.useGlobalFilters(new PrismaExceptionFilter());
	await app.listen(3333);
}

bootstrap();
