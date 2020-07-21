import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormService } from '../../../services/form/form.service';
import { ChatService } from '../../../services/chat/chat.service';

import { Auth } from '../../../interfaces/auth';
import { SocketService } from 'src/app/services/socket/socket.service';

import { DataShareService } from 'src/app/services/utils/data-share.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  public loginError = false;
  public userId: string = null;
  public registrationForm: FormGroup;

  constructor(
    private router: Router,
    private formService: FormService,
    private chatService: ChatService,
    private socketService: SocketService,
    private dataShareService: DataShareService
  ) {
    this.registrationForm = this.formService.createRegistrationForm();
  }

  ngOnInit(): void {
    this.userId = this.dataShareService.getUserId();
    this.establishSocketConnection();
  }

  async establishSocketConnection() {
    try {
      if (this.userId === '' || typeof this.userId === 'undefined' || this.userId === null) {
        this.router.navigate(['/']);
      } else {
        await this.socketService.connectSocket(this.userId);
      }
    } catch (error) {
      alert('Something went wrong');
    }
  }

  register(): void {
    if (this.registrationForm.valid) {
      this.chatService.register(this.registrationForm.value).subscribe(
        (response: Auth) => {
          this.registrationForm.reset();
          alert('User created Successfully');
          this.router.navigate(['/pages/authentication/admin']);
        })
    }
  }

  logout() {
    this.chatService.removeLS()
      .then((removedLs: boolean) => {
        this.socketService.logout({ userId: this.userId }).subscribe((response: Auth) => {
          this.router.navigate(['/']);
        });
      })
      .catch((error: Error) => {
        alert('oopss!!! Something Went Wrong' + error.message);
        throw error;
      });
  }
}