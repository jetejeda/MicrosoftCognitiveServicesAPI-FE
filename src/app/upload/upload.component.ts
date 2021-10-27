import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UploadService } from '../services/upload.service';
import {WebcamImage} from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  
  public webcamImage!: WebcamImage;
  private trigger: Subject<void> = new Subject<void>();
  
  emailForm: FormGroup;
  disabled = true;

  showCamera: boolean = false;
  isWaiting: boolean = false;
  showResult: boolean = false;
  isImage1: boolean = true;

  waitingImg = '../assets/Images/waiting.gif';
  tmpResult = '../assets/Images/tmpResult.png'; 

  url1="../assets/Images/icon-image.jpg";
  url2="../assets/Images/icon-image.jpg";

  email = "";
  useEmail = false;
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

  //* Camera controls and functions
  triggerSnapshot(): void {
    this.trigger.next();
  }
  
  handleImage(webcamImage: WebcamImage, isImage1: boolean): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    if(isImage1){
      this.url1 = webcamImage.imageAsDataUrl;
      this.isImage1 = false;
    }else{
      this.url2 = webcamImage.imageAsDataUrl;
    }
    let file = this.dataURLtoFile(webcamImage.imageAsDataUrl, 'image.png');
    this.onFileUploadAfterConvertedBase64(file, isImage1);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  dataURLtoFile(dataurl: any, filename: any) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}

  //* Data submit and post to backend
  submitData(){
    
    if( !this.emailForm.valid ){

      console.log("error, email no ingresado");
      Swal.fire({
        title: 'Correo Electrónico inválido',
        text: 'Revise el correo electrónico ingresado e intente de nuevo.',
        icon: 'error',
        customClass:{
          confirmButton: "md-button",
        },
        buttonsStyling: false
      })

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
        //setTimeout(() => {  this.isWaiting = false; this.showResult = true; }, 3000); 

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
            this.isWaiting = false;

          }
        )

      }else{

        Swal.fire({
          title: 'Archivos faltantes',
          text: 'Tiene que subir dos imagenes para poder hacer la comparación. Revise las imagenes adjuntas e intente de nuevo.',
          icon: 'error',
          customClass:{
            confirmButton: "md-button",
          },
          buttonsStyling: false
        })
        console.log("Alguno de los archivos hace falta");
        
      }

    }
  }

  //* File upload functions
  onFileUpload(e:any, isImage1: boolean){
    if(isImage1){
      this.MultipleFile![0] = e.target.files[0];
    }else{
      this.MultipleFile![1] = e.target.files[0];
    }
    this.onSelectFile(e, isImage1);
  }

  onFileUploadAfterConvertedBase64(file:any, isImage1: boolean){
    if(isImage1){
      this.MultipleFile![0] = file;
    }else{
      this.MultipleFile![1] = file;
    }
    this.onSelectFileAfterConvertedBase64(file, isImage1);
  }

  onChangeSendEmail(e:any){

    if(!e.checked){

      this.emailForm.get('email')?.clearValidators(); 
      this.useEmail = false;
    }else{
      this.useEmail = true;
      this.emailForm.get('email')?.addValidators(
        [
          Validators.required,
          Validators.pattern('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$')
        ]
      ); 

    }

    this.emailForm.get('email')?.updateValueAndValidity();

  }

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

  onSelectFileAfterConvertedBase64(file: any, isImage1: boolean){
    
    if(file){

      let reader = new FileReader();
      reader.readAsDataURL(file);
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
