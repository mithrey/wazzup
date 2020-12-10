import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class NoteService {
    constructor(private http: HttpClient) { }

    getNotes(limit, skip) {
        let params = new HttpParams().set("l",limit).set("s", skip);
        return this.http.get('api/notes', {params});
    }

    getNotesCount() {
        return this.http.get('api/notesCount');
    }

    create(text: string) {
        return this.http.post('api/note', { text });
    }

    deleteNote(id: number) {
        return this.http.delete(`api/note/${id}`);
    }

    getNote(id: number) {
        return this.http.get(`api/note/${id}`);
    }

    update(text: string, id: number) {
        return this.http.put(`api/note/${id}`, { text, id });
    }

    setLinkSharing(id: number, state: boolean){
        return this.http.put(`api/noteLinkSharing/${id}`, { state });
    }

}