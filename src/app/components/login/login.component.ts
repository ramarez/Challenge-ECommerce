import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    message: string = "";
    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)])
    });

    constructor(private accountService: AccountService,
        private router: Router
    ) {

    }

    onSubmit() {
        this.message = "";
        this.accountService.login(this.email?.value as string, this.password?.value as string)
            .then(() => this.router.navigateByUrl("/products"))
            .catch((e) => this.message = e);
    }

    get password(): FormControl {
        return this.loginForm.get('password') as FormControl;
    }

    get email(): FormControl {
        return this.loginForm.get('email') as FormControl;
    }
}
