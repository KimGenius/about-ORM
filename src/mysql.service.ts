import { Injectable } from '@nestjs/common'

@Injectable()
export class MysqlService {
  connection
  async query(sql) {
    if (!this.connection) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mysql = require('mysql2/promise')
      this.connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Qwer!234',
        database: 'node_orm',
      })
      await this.connection.connect()
    }
    const label = Math.random().toString(36).substr(1, 8)
    console.time('Query' + label)
    await this.connection.query(sql)
    console.timeEnd('Query' + label)
  }
}
