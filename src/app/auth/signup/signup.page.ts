import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  
  signupForm:FormGroup;

  constructor() { 
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup<any> {
    return new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
      username:new FormControl('',Validators.required),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
      confirmpassword:new FormControl('',[Validators.required,Validators.minLength(6)]),
      bio:new FormControl('',Validators.required)
    })
  }

  ngOnInit() {
  }

  onSignUp(){
    console.log(this.signupForm.value)
  }

  //getters
  get email(){
    return this.signupForm.get('email');
  }

  get username(){
    return this.signupForm.get('username');
  }

  get password(){
    return this.signupForm.get('password');
  }

  get confirmpassword(){
    return this.signupForm.get('confirmpassword');
  }

  get bio(){
    return this.signupForm.get('bio');
  }

}
