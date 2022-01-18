import {get} from 'axios'
export class httpClient {
  get(endpoint){
    get(endpoint).then(
      response => response.data
    )
  }
}