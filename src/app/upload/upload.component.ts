import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  
  emailForm: FormGroup;
  isWaiting: boolean = false;
  disabled = true;
  url1="../assets/Images/icon-image.jpg";
  url2="../assets/Images/icon-image.jpg";
  email = "";
  formulario = new FormData();

  constructor(private formBuilder: FormBuilder) { 

    this.emailForm = this.formBuilder.group({
      sendToEmail: [false, [Validators.required]],
      email: ['', [] ]
    });

  }

  ngOnInit(): void {
  }

  MultipleFile?: Array<File> = [];

  submitData(){
    
    if( !this.emailForm.valid ){

      console.log("error, email no ingresado");

    }else{

      let data = this.emailForm.getRawValue();

      this.formulario = new FormData();

      this.formulario.append("email", data.email);
      this.formulario.append("sendToEmail", data.sendToEmail);

      console.log(this.MultipleFile)

      if(this.MultipleFile?.length == 2){

        this.formulario.append("image1", new Blob([this.MultipleFile[0]]), this.MultipleFile[0].name);
        this.formulario.append("image2", new Blob([this.MultipleFile[1]]), this.MultipleFile[1].name);
        
      }else{

        console.log("Alguno de los archivos hace falta");
        
      }

    }
  }

  onFileUpload(e:any, isImage1: boolean){

    if(e.target.files){

      if(isImage1){
        this.MultipleFile![0] = e.target.files[0];
      }else{
        this.MultipleFile![1] = e.target.files[0];
      }

      this.onSelectFile(e, isImage1);

    }
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

}
