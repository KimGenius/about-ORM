import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { AppService } from './app.service'

import { PrismaService } from './prisma.service'
import { User as UserModel } from '@prisma/client'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/users')
  async getUsers(@Param('id') id: string): Promise<UserModel[]> {
    const result = []
    for (let i = 0; i < 1000000; i++) {
      console.log(i)
      result.push(await this.prismaService.user.findMany())
    }
    return result
  }


  @Get('/users/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.prismaService.user.findUnique({ where: { id: Number(id) } })
  }

  @Post('/users')
  async saveUser(@Param('id') id: string) {
    const data = []
    for (let i = 0; i < 31000; i++) {
      data.push({
        name: '김영재',
        email: `${Math.random().toString(36).substr(2,11)}@${Math.random().toString(36).substr(2,11)}.com`,
      })
    }
    await this.prismaService.user.createMany({ data })
  }

  @Put('/users/:id')
  async updateUser() {
    await this.prismaService.user.update({
      where: { id: 1 },
      data: { email: 'youngjae@daily-funding.com' },
    })
  }

  @Delete('/users/:id')
  async deleteUser() {
    await this.prismaService.user.delete({
      where: {
        id: 1,
      },
    })
  }

  @Get('/users/:id/posts')
  async getUserPostList(@Param('id') id: string): Promise<UserModel> {
    return await this.prismaService.user.findUnique({
      where: { id: Number(id) },
      include: { posts: true },
    })
  }
}
