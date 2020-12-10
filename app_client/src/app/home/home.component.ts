import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { PlatformLocation } from '@angular/common';
import { User, Note } from '@/_models';
import { UserService, AuthenticationService, NoteService, AlertService } from '@/_services';
import { Router } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    // MatPaginator Inputs
    maxPages: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    currentUser: User;
    notes: Array<Note> = [];
    pages: Array<number> = [];
    pageOfItems: Array<Note> = [];
    socket: WebSocket;
    skip: number = 0;
    constructor(
        private authenticationService: AuthenticationService,
        private noteService: NoteService,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    updateNotes(){
        this.noteService.getNotesCount()
        .pipe(first())
        .subscribe((res : any) => this.pages = Array(Math.ceil(res.data/this.pageSize)).fill(1).map((x, i) => i + 1) );
        this.noteService.getNotes(this.pageSize, this.skip)
        .pipe(first())
        .subscribe((res : any) => this.notes = res.data);
    }

    ngOnInit() {
        
        this.updateNotes()

    }

    setPage(val) {
        this.pageIndex = val;
        this.skip = (this.pageIndex-1)*this.pageSize;
        this.updateNotes()
    }

    deleteNote(id){
        this.noteService.deleteNote(id)
            .pipe(first())
            .subscribe( 
                res => {
                    this.alertService.success("Note deleted");
                    this.updateNotes();
                },
                error => {
                    this.alertService.error("Error deleting note");
            });
    }

    generateLink(path){
        return window.location.href + 'r/' + path
    }

    setLinkSharing(id, state){
        this.noteService.setLinkSharing(id, state)
            .pipe(first())
            .subscribe( 
                res => {
                    this.alertService.success("Success!");
                    this.updateNotes();
                },
                error => {
                    this.alertService.error("Error");
            });
    }

}