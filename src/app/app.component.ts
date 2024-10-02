import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { AccountService } from './modules/security/services/account.service';
import { UserService } from './modules/security/services/user.service';
import { NotificationModule } from './modules/notification/notification.module';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule, NavbarComponent, RouterModule, FooterComponent, NotificationModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'Challenge-ECommerce';

    constructor(private accountService: AccountService,
        private userService: UserService,
        private router: Router
    ) {
        
    }

    logout(): void {
        this.accountService.logout().then(() => this.router.navigateByUrl("/login"));
    }

    get isLogged(): boolean {
        return this.userService.isLogged;
    }
}
