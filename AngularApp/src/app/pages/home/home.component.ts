import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SocketService } from './../../services/socket/socket.service';
import { ChatService } from './../../services/chat/chat.service';
import { DataShareService } from './../../services/utils/data-share.service';

import { Auth } from './../../interfaces/auth';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	public userId: string = null;
	public username: string = null;

	constructor(
		private chatService: ChatService,
		private socketService: SocketService,
		private dataShareService: DataShareService,
		private router: Router
	) { }

	ngOnInit() {
		this.userId = this.dataShareService.getUserId();
		this.username = this.dataShareService.getUserName();
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

	logout() {
		this.chatService.removeLS()
			.then((removedLs: boolean) => {
				this.socketService.logout({ userId: this.userId }).subscribe((response: Auth) => {
					this.router.navigate(['/']);
				});
			})
			.catch((error: Error) => {
				alert('oopss!!! Something Went Wrong' +error.message);
				throw error;
			});
	}
}
