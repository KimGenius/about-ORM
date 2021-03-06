import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { AppService } from './app.service'

import { PrismaService } from './prisma.service'
import { User as UserModel } from '@prisma/client'
import { MysqlService } from './mysql.service'

@Controller()
export class AppController {
  private START_IDX: number
  private END_IDX: number
  constructor(
    private readonly appService: AppService,
    private readonly prismaService: PrismaService,
    private readonly mysqlService: MysqlService,
  ) {
    this.START_IDX = 1830001
    this.END_IDX = 2030000
  }

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/users')
  async getUsers() {
    const label = Math.random().toString(36).substr(1, 8)
    console.time('Query' + label)
    await this.prismaService.user.findMany()
    console.timeEnd('Query' + label)
  }

  @Get('/users-raw')
  async getUsersRaw() {
    const label = Math.random().toString(36).substr(1, 8)
    await this.mysqlService.query('SELECT * FROM user;')
  }

  @Get('/users/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.prismaService.user.findUnique({ where: { id: Number(id) } })
  }

  @Post('/users')
  async saveUser() {
    const data = []
    for (let i = 0; i < 200000; i++) {
      data.push({
        name: '김영재',
        email: `${Math.random().toString(36).substr(2, 11)}@${Math.random()
          .toString(36)
          .substr(2, 11)}.com`,
      })
    }
    const label = Math.random().toString(36).substr(1, 8)
    console.time('Query' + label)
    await this.prismaService.user2.createMany({ data })
    console.timeEnd('Query' + label)
  }

  @Post('/users-raw')
  async saveUserRaw() {
    let data = ''
    for (let i = 0; i < 200000; i++) {
      data += `("김영재", "${Math.random()
        .toString(36)
        .substr(2, 11)}@${Math.random().toString(36).substr(2, 11)}.com"), `
    }
    data = data.substr(0, data.length - 2)
    await this.mysqlService.query(
      `INSERT INTO user(name, email) VALUES ${data}`,
    )
  }
  @Put('/users')
  async updateUser() {
    const targetList = []
    for (let i = 0; i < 300; i++) {
      const targetIdx = Math.floor(
        Math.random() * (this.END_IDX - this.START_IDX + 1) + this.START_IDX,
      )
      if (!targetList.includes(targetIdx)) {
        targetList.push(targetIdx)
        i--
      }
    }
    const OR = []
    for (const id of targetList) {
      OR.push({ id })
    }
    const label = Math.random().toString(36).substr(1, 8)
    console.time('Query' + label)
    await this.prismaService.user.updateMany({
      where: { OR },
      data: { dummy: `${Math.random().toString(36).substr(2, 11)}` },
    })
    console.timeEnd('Query' + label)
  }

  @Put('/users-raw')
  async updateUserRaw() {
    const targetList = []
    for (let i = 0; i < 300; i++) {
      const targetIdx = Math.floor(
        Math.random() * (this.END_IDX - this.START_IDX + 1) + this.START_IDX,
      )
      if (!targetList.includes(targetIdx)) {
        targetList.push(targetIdx)
        i--
      }
    }
    let OR = ''
    for (const id of targetList) {
      OR += `id = ${id} OR `
    }
    OR = OR.substr(0, OR.length - 3)
    await this.mysqlService.query(
      `UPDATE user SET dummy = "${Math.random()
        .toString(36)
        .substr(2, 11)}" WHERE ${OR}`,
    )
  }

  @Delete('/users')
  async deleteUserAll() {
    const label = Math.random().toString(36).substr(1, 8)
    console.time('Query' + label)
    await this.prismaService.user.deleteMany()
    console.timeEnd('Query' + label)
  }

  @Delete('/users-raw')
  async deleteUserAllRaw() {
    await this.mysqlService.query('DELETE FROM user')
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
