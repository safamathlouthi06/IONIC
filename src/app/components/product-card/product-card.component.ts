import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

/**
 * Composant de carte produit réutilisable
 * Affiche un produit sous forme de carte avec ses informations principales
 * 
 * @example
 * <app-product-card [product]="monProduit"></app-product-card>
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  
  /**
   * Produit à afficher dans la carte
   * Doit être fourni par le composant parent
   * 
   * @required
   */
  @Input() product!: Product;
  
}