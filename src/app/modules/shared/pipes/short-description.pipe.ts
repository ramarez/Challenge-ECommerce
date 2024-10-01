import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shortDescription',
    standalone: true
})
export class ShortDescriptionPipe implements PipeTransform {

    transform(value: string, length: number): string {
        return value.substring(0, length);
    }
}
