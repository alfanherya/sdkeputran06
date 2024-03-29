import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/services/user.service';
import { Transaction } from '../../../model/transaction';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  productList: Array<Product>;
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();
  obs: Observable<any>;
  errorMessage: string;
  infoMessage: string;
  currentUser: User;

  constructor(private userService: UserService, private router: Router,
    private cdr: ChangeDetectorRef) {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
  }

  ngOnInit(): void {
    this.findAllProducts();
    this.obs = this.dataSource.connect();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }
  findAllProducts() {
    this.userService.findAllProducts().subscribe(data => {
      this.productList = data;
      this.dataSource.data = data;
    });
  }
  purchaseProduct(product: Product) {
    if (!this.currentUser) {
      this.errorMessage = "You should sign in to purchase a product";
      return;
    }
    var transaction = new Transaction();
    transaction.product = product;
    transaction.user = this.currentUser;
    this.userService.purchaseProduct(transaction).subscribe(data => {
      this.infoMessage = "Mission is completed.";
    }, err => {
      this.errorMessage = "Unexpected error occurred";
    });
  }

  detail(product: Product) {
    localStorage.setItem("currentProduct", JSON.stringify(product));
    this.router.navigate(['/detail', product.id]);
  }

}
