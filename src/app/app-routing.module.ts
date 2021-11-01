import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResultComponent } from './result/result.component';
import { UploadComponent } from './upload/upload.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent
  },
  {
    path: 'result/:id',
    component: ResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
