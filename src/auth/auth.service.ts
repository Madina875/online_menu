import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/sequelize';
import { Response, Request } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInuserDto } from '../user/dto/signin-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.serivce';
import { UserRole } from '../user/entities/user-role.entity';
import { Role } from 'src/role/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UserService,
    private readonly mailService: MailService,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async signup(createuserDto: CreateUserDto) {
    const existing = await this.usersService.findUserByEmail(
      createuserDto.email,
    );
    if (existing) throw new ConflictException('User already exists!');

    // const hashedPassword = await bcrypt.hash(createuserDto.password, 7);
    const activation_link = uuidv4();

    const user = await this.usersService.create({
      ...createuserDto,
      // password: hashedPassword,
      activation_link,
    });

    try {
      await this.mailService.sendUserActivationLink(user);
    } catch (error) {
      throw new ServiceUnavailableException('Email error occurred');
    }

    return {
      message: "Ro'yhatdan o'tdingiz. Email orqali akkauntni faollashtiring.",
    };
  }

  async signin(dto: SignInuserDto, res: Response) {
    let user = await this.usersService.findUserByEmail(dto.email);

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException("Email yoki parol noto'g'ri!");
    }

    console.log('Initial user:', user);
    console.log('Initial user.role:', user.role);

    // If role is not loaded, reload the user with role association
    if (!user.role || user.role.length === 0) {
      console.log('Reloading user with role association...');
      const reloadedUser = await this.userModel.findByPk(user.id, {
        include: [
          {
            model: Role,
            attributes: ['id', 'role'],
            through: { attributes: [] },
          },
        ],
        raw: false, // Ensure we get the full model instance
      });
      console.log('Reloaded user:', reloadedUser);
      console.log('Reloaded user.role:', reloadedUser?.role);
      if (reloadedUser) {
        user = reloadedUser;
      }
    }

    console.log('Final user with role:', user.role);

    // Access role from dataValues since the association isn't loading properly
    const userRoles = user.dataValues?.role || [];
    const roleName = userRoles.length > 0 ? userRoles[0].role : null;

    console.log('userRoles from dataValues:', userRoles);
    console.log('roleName:', roleName);

    if (!roleName) {
      throw new UnauthorizedException('User has no role assigned');
    }

    const payload = {
      id: user.id,
      role: roleName,
      is_active: user.is_active,
    };
    let secretKey: string;

    switch (roleName) {
      case 'superadmin':
        secretKey = process.env.ACCESS_TOKEN_KEYSuperadmin!;
        break;
      case 'admin':
        secretKey = process.env.ACCESS_TOKEN_KEYAdmin!;
        break;
      case 'manager':
        secretKey = process.env.ACCESS_TOKEN_KEYManager!;
        break;
      case 'stuff':
        secretKey = process.env.ACCESS_TOKEN_KEYStuff!;
        break;
      case 'delivery':
        secretKey = process.env.ACCESS_TOKEN_KEYDelivery!;
        break;
      case 'customer':
        secretKey = process.env.ACCESS_TOKEN_KEYCustomer!;
        break;
      default:
        secretKey = process.env.ACCESS_TOKEN_KEYUser!;
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: process.env.SECRET_TOKEN_TIMEUser,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_KEYUser,
      expiresIn: process.env.REFRESH_TOKEN_TIMEUser, //each
    });

    user.refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIMEUser!,
    });

    res.json({
      message: 'Signed in!',
      id: user.id,
      role: roleName,
      accessToken,
    });
  }

  async activate(activationLink: string) {
    const user = await this.userModel.findOne({
      where: { activation_link: activationLink },
    });
    if (!user) throw new NotFoundException('Activation link invalid');
    if (user.is_active)
      throw new ConflictException('Account already activated');
    user.is_active = true;
    await user.save();
    return { message: 'Account activated!' };
  }

  async refreshToken(id: number, req: Request, res: Response) {
    const token = req.cookies?.refresh_token;
    if (!token) throw new BadRequestException('Token required');
    const decoded: any = jwt.verify(token, process.env.REFRESH_TOKEN_KEYUser!);
    if (decoded.id !== id) throw new UnauthorizedException('Invalid user ID');
    const user = await this.userModel.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          attributes: ['id', 'role'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user || !user.refresh_token)
      throw new UnauthorizedException('Invalid refresh token');

    const isMatch = await bcrypt.compare(token, user.refresh_token);

    if (!isMatch) throw new UnauthorizedException('Refresh token mismatch');

    const roles = user.dataValues.role;
    const roleName = roles?.[0]?.dataValues?.role;
    const payload = { id: user.id, role: roleName, is_active: user.is_active };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEYUser!, {
      expiresIn: process.env.SECRET_TOKEN_TIMEUser,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEYUser!, {
      expiresIn: process.env.REFRESH_TOKEN_TIMEUser,
    });

    user.refresh_token = await bcrypt.hash(refreshToken, 7);
    await user.save();

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: +process.env.COOKIE_TIMEUser!,
    });

    res.json({
      message: 'Token refreshed',
      accessToken,
    });
  }

  async signout(id: number, res: Response) {
    // Find the user by ID
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.refresh_token = null;
    await user.save();

    // Clear the refresh token cookie
    res.clearCookie('refresh_token');
    res.json({ message: 'User signed out successfully!' });
  }

  async createSuperadmin(createUserDto: CreateUserDto) {
    const existingSuperadmin = await this.userModel.findOne({
      include: [
        {
          model: Role,
          where: { role: 'superadmin' },
          through: { attributes: [] },
        },
      ],
    });
    if (existingSuperadmin) {
      throw new ConflictException('Superadmin already exists!');
    }

    // Get the superadmin role first
    const superadminRole = await Role.findOne({
      where: { role: 'superadmin' },
    });
    if (!superadminRole) {
      throw new NotFoundException('Superadmin role not found');
    }
    console.log('Found superadmin role:', superadminRole);

    // Create user without role first
    const activation_link = uuidv4();
    const { role, ...rest } = createUserDto;

    // Create user directly without going through UserService.create()
    const hashedPassword = await bcrypt.hash(rest.password, 7);
    const user = await this.userModel.create({
      ...rest,
      password: hashedPassword,
      activation_link,
      is_active: true,
    });

    // Assign the superadmin role
    await user.$set('role', [superadminRole.id]);
    await user.save();

    console.log('Superadmin created with ID:', user.id);

    return { message: 'Superadmin created successfully!' };
  }
}
