import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PublicService {
    constructor(private http: HttpClient) {}

    getNoteText(path: string) {
        return this.http.get<any>(`/api/noteText/${path}`);
    }

}