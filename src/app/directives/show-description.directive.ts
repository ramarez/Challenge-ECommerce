import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[showDescription]',
    standalone: true
})
export class ShowDescriptionDirective {
    _currentColor: any;

    constructor(private el: ElementRef) { 
        this._currentColor = el.nativeElement.style.color;
    }

    @HostListener('dblclick') onDblClick() {
        console.log("current color :" + this.el.nativeElement.style.color);
        this.el.nativeElement.style.color = this._currentColor;
    }

    @HostListener('click') onClick() {
        console.log("current color :" + this.el.nativeElement.style.color);
        this.el.nativeElement.style.color = 'red';
    }
}
