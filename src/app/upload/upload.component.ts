import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  
  emailForm: FormGroup;
  disabled = true;

  isWaiting: boolean = false;
  showResult: boolean = false;
  waitingImg = '../assets/Images/waiting.gif';
  tmpResult = '../assets/Images/tmpResult.png'; 

  url1="../assets/Images/icon-image.jpg";
  url2="../assets/Images/icon-image.jpg";

  email = "";
  form = new FormData();

  constructor(
    private formBuilder: FormBuilder,
    private uploadService: UploadService) { 

    this.emailForm = this.formBuilder.group({
      sendToEmail: [false, [Validators.required]],
      email: ['', [] ]
    });

  }

  MultipleFile?: Array<File> = [];

  ngOnInit(): void {
  }

  submitData(){
    
    if( !this.emailForm.valid ){

      console.log("error, email no ingresado");

    }else{

      this.form = new FormData();
      let data = this.emailForm.getRawValue();

      this.form.append("email", data.email);
      this.form.append("sendToEmail", data.sendToEmail);

      if(this.MultipleFile?.length == 2 && this.MultipleFile[0] != undefined && this.MultipleFile[1] != undefined){

        this.form.append("image1", new Blob([this.MultipleFile![0]]), this.MultipleFile![0].name);
        this.form.append("image2", new Blob([this.MultipleFile![1]]), this.MultipleFile![1].name);

        this.isWaiting = true;

        //* Wait to show temporal result
        setTimeout(() => {  this.isWaiting = false; this.showResult = true; }, 3000);
                
        //* Commented for presentation purpose
        this.uploadService.sendImages(this.form).subscribe(
          res => {
            console.log(res);
            
            this.isWaiting = false; this.showResult = true;

          }, err => {

            console.log("Error de respuesta");
            console.log(err);

            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error, intente de nuevo más tarde.',
              icon: 'error',
              customClass:{
                confirmButton: "md-button",
              },
              buttonsStyling: false
            })
          }
        )

      }else{

        console.log("Alguno de los archivos hace falta");
        
      }

    }
  }

  onFileUpload(e:any, isImage1: boolean){

    if(isImage1){
      this.MultipleFile![0] = e.target.files[0];
    }else{
      this.MultipleFile![1] = e.target.files[0];
    }

    this.onSelectFile(e, isImage1);
  }

  /**
   * Get toogle value.
   *
   * Get toogle value to use it to validate email or not.
   *
   * @alias    onChangeSendEmail
   * @param event   e           event that has the checked boolean.
   *
   */
  onChangeSendEmail(e:any){

    if(!e.checked){

      this.emailForm.get('email')?.clearValidators(); 

    }else{

      this.emailForm.get('email')?.addValidators(
        [
          Validators.required,
          Validators.pattern('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$')
        ]
      ); 

    }

    this.emailForm.get('email')?.updateValueAndValidity();


  }

  /**
   * Add file in form
   *
   * Get added file and set it in the form
   *
   * @alias           onSelectFile
   * @param event     e           event that has the checked boolean.
   * @param boolean   isImage1    Boolean that defines where the actual image is set 
   *
   */
  onSelectFile(e: any, isImage1: boolean){
    
    if(e.target.files.length > 0){

      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = (event: any)=>{
        if(isImage1)
          this.url1 = event.target.result;
        else
          this.url2 = event.target.result;
      }

    }else{
      if(isImage1)
          this.url1 = '../assets/Images/icon-image.jpg';
        else
          this.url2 = '../assets/Images/icon-image.jpg';
    }
  }

  reload(){
    window.location.reload();
  }

}
