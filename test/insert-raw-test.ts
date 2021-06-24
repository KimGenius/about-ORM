import http from 'k6/http'
import { sleep } from 'k6'

export default function () {
  http.post('http://localhost:3000/users-raw')
  sleep(1)
}
