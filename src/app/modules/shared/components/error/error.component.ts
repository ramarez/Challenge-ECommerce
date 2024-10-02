import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-error',
    standalone: true,
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorComponent {
    @Input({ required: true }) message!: string;
    @Output() reloadPage = new EventEmitter<void>();
}
