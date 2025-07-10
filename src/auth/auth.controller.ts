import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Res,
  Get,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInuserDto } from '../user/dto/signin-user.dto';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register user (any role: admin, customer, etc.)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // Sign in user and set refresh_token in cookie
  @Post('signin')
  async signin(@Body() dto: SignInuserDto, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  // Email activation endpoint
  @Get('user/activate/:link')
  async activate(@Param('link') activationLink: string) {
    return this.authService.activate(activationLink);
  }

  @Get('refresh/:id')
  async refreshToken(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.refreshToken(id, req, res);
  }

  @Post('signout/:id')
  async signout(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return this.authService.signout(id, res);
  }

  // Create the first superadmin (only if none exists)
  @Post('create-superadmin')
  async createSuperadmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.createSuperadmin(createUserDto);
  }
}
