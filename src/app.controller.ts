import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

import { PrismaService } from './prisma.service'
import { Post as PostModel, User as UserModel } from '@prisma/client'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly prismaService: PrismaService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.prismaService.user.findUnique({ where: { id: Number(id) } })
  }

  @Post('/users')
  async saveUser(@Param('id') id: string) {
    await this.prismaService.user.create({
      data: {
        name: "김영재",
        email: "geniusk1047@naver.com"
      }
    })
  }

  @Put('/users/:id')
  async updateUser() {
    await this.prismaService.user.update({
      where: { id: 1 },
      data: { email: 'youngjae@daily-funding.com' },
    })
  }
}
