import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '@/_models';
import { AuthenticationService, NoteService, AlertService } from '@/_services';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({ templateUrl: 'note.component.html' })
export class NoteComponent implements OnInit {
    currentUser: User;
    noteForm: FormGroup;
    users = [];
    recipients: Array<string> = [];
    filtered: Observable<string[]>;
    constructor(
        private authenticationService: AuthenticationService,
        private noteService: NoteService,
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
    }

    ngOnInit() {
        this.noteForm = this.formBuilder.group({
            text: ['', [Validators.required, Validators.max(1000)]]
        });

    }

    get f() { return this.noteForm.controls; }

    onSubmit() {

        // reset alerts on submit
        this.alertService.clear();

        console.log(this.noteForm);
        // stop here if form is invalid
        if (this.noteForm.invalid) {
            this.alertService.error("Note cannot be empty");
            return;
        }

        this.noteService.create(this.f.text.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Note created', true);
                    this.router.navigate(['/']);
                },
                error => {
                    this.alertService.error(error);
                });
                
    }
}