import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  result: string = '';
  id: string = '';
  actualUrl: string = environment.url + this.router.url;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public uploadService: UploadService
    ) { }

  ngOnInit(): void {
    console.log(this.actualUrl)
    this.id = this.route.snapshot.params.id;
    this.uploadService.getImage(this.id).subscribe(
      res => {
        this.result = `data:image/png;base64,${res.answer}`
      }, 
      err => {

      }
    )
  }

  reload(){
    this.router.navigate(['/']);
  }
}
