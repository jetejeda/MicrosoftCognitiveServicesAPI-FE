import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  tmpResult: string = '';
  id: string = '';

  constructor(
    public router: Router,
    public route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
  }

  reload(){
    this.router.navigate(['/']);
  }
}
