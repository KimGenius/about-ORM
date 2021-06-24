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
    for (let i = 0; i < 30000; i++) {
      data.push({
        name: '김영재',
        email: `${Math.random().toString(36).substr(2, 11)}@${Math.random()
          .toString(36)
          .substr(2, 11)}.com`,
      })
    }
    console.time('Query')
    await this.prismaService.user.createMany({ data })
    console.timeEnd('Query')
  }

  @Post('/users-raw')
  async saveUserRaw() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mysql = require('mysql2')
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Rladudwo132!3@',
      database: 'node_orm',
    })
    connection.connect()
    let data = ''
    for (let i = 0; i < 30000; i++) {
      data += `("김영재", "${Math.random()
        .toString(36)
        .substr(2, 11)}@${Math.random().toString(36).substr(2, 11)}.com"), `
    }
    data = data.substr(0, data.length - 2)
    console.time('Query')
    connection.query(
      `INSERT INTO user(name, email) VALUES ${data}`,
      function (error, results, fields) {
        if (error) throw error
        console.timeEnd('Query')
        connection.end()
      },
    )
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

  @Post('/users/:id/posts')
  async saveUserPost() {
    const createUserQuery = this.prismaService.user.create({
      data: {
        name: '김영재',
        email: `${Math.random().toString(36).substr(2, 11)}@${Math.random()
          .toString(36)
          .substr(2, 11)}.com`,
      },
    })
    const createPostQuery = this.prismaService.post.create({
      data: {
        title: '김영재',
      },
    })
    await this.prismaService.$transaction([createUserQuery, createPostQuery])
  }
}
