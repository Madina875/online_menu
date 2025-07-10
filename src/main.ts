import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import chalk from 'chalk';

async function bootstrap() {
  try {
    const PORT = process.env.PORT ?? 3030;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');
    
    const config = new DocumentBuilder()
      .setTitle('Online Menu API 🍽️')
      .setDescription(
        'Robust and scalable RESTful API for managing online food services.\n\n' +
          '**Features:**\n' +
          '- Secure Authentication (JWT + Cookies)\n' +
          '- DTO Validation with class-validator\n' +
          '- Email & Mailer Integration\n' +
          '- Guarded Routes by Role\n' +
          '- Fully documented via Swagger\n\n' +
          'Built with NestJS for enterprise-grade reliability.',
      )
      .setVersion('1.0.0')
      .addTag('API | Auth | Validation | Email | Swagger')
      .addBearerAuth()
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);

    await app.listen(PORT, () => {
      console.log(`
  🍽️ ${chalk.magentaBright.magentaBright(' Restaurant System Online! ')}
  🔗 URL: ${chalk.cyan.underline(`http://localhost:${PORT}`)}
  🕓 Time: ${chalk.gray(new Date().toLocaleTimeString())}
  `);
    });
  } catch (error) {
    console.error(chalk.bgRed.white.bold('❌ Server failed to start!'));
    console.error(chalk.redBright('💥 Error details:'), error.message || error);
    process.exit(1);
  }
}

bootstrap();
