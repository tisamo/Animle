import {Component} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {AuthService} from "../../../shared/services/auth.service";
import {LoginInfos, RegisterInfos} from "../../../shared/interfaces/auth";
import {PopupService} from "../../../shared/services/popup.service";

interface LoginInput {
  label: string;
  formControlName: string;
  type: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authForm: FormGroup = new FormGroup({});
  inputs: LoginInput[] = [];
  title = 'Login';
  mode = 'login';
  buttonText = '';

  constructor(private actr: ActivatedRoute,
              private authService: AuthService,
              private popupService: PopupService,
              private router: Router) {
    if(this.authService.isAuthenticated){
      this.router.navigate(['/']);
    }
    this.setTemplateAccordingToRouter(this.actr.snapshot.data['mode']);
  }

  private setTemplateAccordingToRouter(mode: string) {
    this.mode = mode;
    this.authForm = new FormGroup({});
    switch (mode) {
      case 'login':
        this.title = "Login";
        this.buttonText = "Login";
        this.inputs = [{label: 'Username', formControlName: 'Name', type: 'text'}, {
          label: 'Password',
          formControlName: 'Password',
          type: 'password'
        }];
        break;
      case 'register':
        this.title = 'Register';
        this.buttonText = 'Register';
        this.inputs = [{label: 'Username', formControlName: 'Name', type: 'text'},
          {label: 'Email', formControlName: 'Email', type: 'email'},
          {label: 'Password', formControlName: 'Password', type: 'password'}];
        break;
      case 'password-reset':
        this.title = 'Password reset';
        this.buttonText = 'Send Email';
        this.inputs = [{label: 'Email', formControlName: 'Email', type: 'email'}];
        break;

    }
    this.inputs.forEach((i) => {
      const validators = [Validators.required];
      if (i.type === 'email') {
        validators.push(Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'));
      }
      if (i.type === 'password') {

      }
      this.authForm.addControl(i.formControlName, new FormControl('', validators));
    })
  }

  public navigate(route: string[]){
    this.router.navigate(route)
  }

  public handleAuthActions(){
    if(!this.authForm.valid) return;
    switch (this.mode) {
      case 'login':
        this.authService.login(this.authForm.value as LoginInfos).subscribe({
          next: (res=>{
            localStorage.setItem('jwt', res.token);
            this.authService.isAuthenticated = true;
            this.router.navigate(['/']);
          }),
          error: (err=>{
            this.popupService.pushErrorMessage(err)
          })
        })
        break;
      case 'register':
        this.authService.register(this.authForm.value as RegisterInfos).subscribe({
          next: (res=>{
            this.popupService.pushNewMessage( 'Succcesful registration!',  3)
            this.router.navigate(['auth', 'login']);

          }),
          error: (err=>{
            this.popupService.pushNewMessage(err.error.response, 3)
          })
        })
        break;
      case 'password-reset':

        break;

    }
  }

}
