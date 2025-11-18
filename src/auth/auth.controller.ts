import { Controller, Get, Post, Body, Res, Req, UseGuards, UnauthorizedException, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { LoginService } from './services/login.service';
import { SignupService } from './services/signup.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { LogoutService } from './services/logout.service';
import { AuthGuard } from '../guards/auth.guard';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { GetUser } from '../decorators/user.decorators';
import { SignUpDto } from './dto/signUp.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly loginService: LoginService,
    private readonly signupService: SignupService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly logoutService: LogoutService,
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.loginService.loginWithCookies(dto, res);
  }

  @Post('signup')
  async signup(@Body() dto: SignUpDto, @Res({ passthrough: true }) res: Response) {
    return this.signupService.signupWithCookies(dto, res);
  }

 
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    this.logger.debug('🔄 Token refresh request received');
    
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      this.logger.warn('❌ Refresh token not found in cookies');
      throw new UnauthorizedException('Refresh token not found');
    }
    
    this.logger.debug('✅ Refresh token found, processing...');
    const result = await this.refreshTokenService.refreshTokensWithCookies(refreshToken, res);
    
    this.logger.log('✅ Tokens refreshed successfully');
    return result;
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@GetUser() user: any, @Res({ passthrough: true }) res: Response) {
    return this.logoutService.logoutWithCookies(user.id, res);
  }


  @Get('session')
  @UseGuards(AuthGuard)
  async session(@GetUser() user: any) {
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      message: 'Session is active',
    };
  }

  @Get('verify')
  @UseGuards(AuthGuard)
  async verify(@GetUser() user: any) {
    // AuthGuard already validated the token and attached user to request
    return {
      success: true,
      message: 'Token is valid',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }


  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@GetUser() user: any) {
    // Return sanitized user object (no sensitive data)
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,

      },
    };
  }
}
