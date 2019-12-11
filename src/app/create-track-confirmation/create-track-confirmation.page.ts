import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hll-create-track-confirmation',
  templateUrl: './create-track-confirmation.page.html',
  styleUrls: ['./create-track-confirmation.page.scss'],
})
export class CreateTrackConfirmationPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log('sup');
    console.log(this.router);
    console.log(this.router.getCurrentNavigation().extras);
  }

}
