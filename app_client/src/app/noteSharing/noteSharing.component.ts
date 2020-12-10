import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { PublicService } from '@/_services';
import { ActivatedRoute } from '@angular/router';


@Component({ templateUrl: 'noteSharing.component.html' })
export class NoteSharingComponent implements OnInit {
    path: string;
    text: string;
    constructor(
        private publicService: PublicService,
        private activateRoute: ActivatedRoute
    ) {

        activateRoute.params.subscribe(params=>this.path=params['path']);
    }

    ngOnInit() {

        this.publicService.getNoteText(this.path)
        .pipe(first())
        .subscribe(
            (data: string) => this.text = data);
    }

}