import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Email} from "../../shared/interfaces/Email";
import {EmailService} from "../../shared/services/email.service";
import {PopupService} from "../../shared/services/popup.service";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
  ],
  providers: [EmailService],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private emailService: EmailService,
              private popupService: PopupService) {
    this.contactForm = new FormGroup({
      'from': new FormControl('', Validators.required),
      'email': new FormControl('', [Validators.required, Validators.email]),
      'subject': new FormControl('', [Validators.required]),
      'body': new FormControl('', Validators.required)
    });
  }

  onSubmit() {
   if(!this.contactForm.valid) return;
   const email: Email = this.contactForm.value;
   email['to'] = 'animlebot@gmail.com';
   this.emailService.sendEmail(email).subscribe(({
     next: ()=>{
       this.popupService.pushNewMessage('Email sent Successfully', 3);
       this.contactForm.reset();
     }, error: (err)=>{
       this.popupService.pushErrorMessage(err);
     }
   }))
  }
}
