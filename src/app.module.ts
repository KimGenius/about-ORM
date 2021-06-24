import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaService } from './prisma.service'
import { MysqlService } from './mysql.service'

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, MysqlService],
})
export class AppModule {}
