import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, Note } from '@/_models';
import { AuthenticationService, NoteService, AlertService } from '@/_services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'noteUpdate.component.html' })
export class NoteUpdateComponent implements OnInit {
    currentUser: User;
    noteForm: FormGroup;
    id: number;
    note: Note;
    constructor(
        private authenticationService: AuthenticationService,
        private noteService: NoteService,
        private formBuilder: FormBuilder,
        private router: Router,
        private alertService: AlertService,
        private activateRoute: ActivatedRoute
    ) {
        this.currentUser = this.authenticationService.currentUserValue;
        activateRoute.params.subscribe(params=>this.id=params['id']);
    }

    ngOnInit() {


        

        this.noteService.getNote(this.id)
        .pipe(first())
        .subscribe(
            (data: Note) => this.noteForm = this.formBuilder.group({
                text: [data.text, [Validators.required, Validators.max(1000)]]
            }),
            error => {
                this.alertService.error(error);
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
        this.noteService.update(this.f.text.value, this.id)
        .pipe(first())
        .subscribe( 
            data => {
                this.alertService.success("Note updated");
                this.router.navigate(['/']);
            },
            error => {
                this.alertService.error("Error updating note");
        });

                
    }
}