import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './components/message/message.component';



@NgModule({
    declarations: [],
    exports: [MessageComponent],
    imports: [
        CommonModule,
        MessageComponent
    ]
})
export class NotificationModule { }
