import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as _ from "lodash";
@Injectable()
export class HttpClientHelper {
  constructor(private http: HttpClient) {}

  createAuthorizationHeader(
    headers: HttpHeaders,
    skipAuthorization: boolean = false
  ) {
    if (!skipAuthorization) {
      var token = localStorage.getItem("token");
      var authorization_header = "";
      if (token) {
        authorization_header = `${token}`;
      }
      headers.append("Accept", "application/json");
      headers.append("Content-Type", "application/json");
      headers.append("Access-Control-Allow-Origin", "*");
      headers.append("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
      return headers.append("authorization", authorization_header);
    }
    return headers;
  }

  get(url) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    let response = this.http.get(url, {
      headers: headers,
    });

    return response;
  }
  delete(url) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers);
    let response = this.http.delete(url, {
      headers: headers,
    });

    return response;
  }
  post(url, data, skipAuthorization: boolean = false) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers, skipAuthorization);
    return this.http.post(url, data, {
      headers: headers,
    });
  }

  put(url, data, skipAuthorization: boolean = false) {
    let headers = new HttpHeaders();
    headers = this.createAuthorizationHeader(headers, skipAuthorization);
    return this.http.put(url, data, {
      headers: headers,
    });
  }
}
