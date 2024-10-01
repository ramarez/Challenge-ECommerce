import { Component, Input } from '@angular/core';
import { IProduct } from '../../models';
import { RouterModule } from '@angular/router';
import { ShortDescriptionPipe } from '../../../shared';

@Component({
    selector: 'app-product',
    standalone: true,
    imports: [RouterModule, ShortDescriptionPipe],
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent {
    @Input({required: true}) product: IProduct = (null as any) as IProduct;
}
