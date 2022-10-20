import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm:FormGroup;

  constructor(private router:Router,private authService:AuthService,public toastCtrl: ToastController) {
    this.loginForm = this.createFormGroup();
   }

  createFormGroup():FormGroup<any>{
    return new FormGroup({
      usernameOrEmail:new FormControl('',Validators.required),
      password:new FormControl('',[Validators.required,Validators.minLength(6)])
    })
  }

  ngOnInit() {
    
  }

  onLogin(){  
    if (this.usernameOrEmail && this.password) {
      this.authService.login(this.usernameOrEmail.value,this.password.value).subscribe((response:any)=>{
        if(response){
          console.log(response);
          this.authService.setSession(response);
          console.log("User is logged in");
          this.router.navigateByUrl('/');
        }
      },async (error:Error | HttpErrorResponse) =>{
        const toast = this.toastCtrl.create({
          message: `${error.name}:Incorrect credentials, try again`,
          duration: 10000,
          position:'bottom',
          color: 'danger'
        });
        (await toast).present();
        setTimeout(async () =>{
          (await toast).dismiss();
        },3000);
      })
    }
  }

  //getters
  get usernameOrEmail(){
    return this.loginForm.get('usernameOrEmail');
  }

  get password(){
    return this.loginForm.get('password');
  }

}
