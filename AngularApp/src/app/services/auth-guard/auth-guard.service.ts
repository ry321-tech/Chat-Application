import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ChatService } from './../chat/chat.service';

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(
		public chatService: ChatService,
		public router: Router
	) { }

	canActivate(): Observable<boolean> {
		return this.chatService.userSessionCheck();
	}
}
