import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendMailServiceService {
  serverApi = '';

  constructor(private http: HttpClient) {
    if (!environment.production) {
      this.serverApi = 'http://localhost:8008';
    }
  }

  public sendEmail(to: string, subject: string, body: string) {
    const URL = `${this.serverApi}/send_mail`;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(URL, JSON.stringify({to, subject, body}), {headers});
  }
}
