import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-product-dash',
  templateUrl: './product-dash.component.html',
  styleUrls: ['./product-dash.component.scss']
})
export class ProductDashComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'category','date', 'freshness','price', 'comment','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private dialog:MatDialog, private api : ApiService) { }

  openDialog() {
    this.dialog.open(DialogComponent,{
      width: '40%'
    }).afterClosed().subscribe(val=>{
      this.getAllProduct();
    })

  }

  deleteProduct(id:number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("Product deleted successfully");
        this.getAllProduct();
      },
      error:()=>{
        alert("error while deleting the product!!");
      }
    })
  }

  editProduct(row : any){
    this.dialog.open(DialogComponent,{
      width: '40%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val==='update'){
        this.getAllProduct();
      }
    })
  }

  getAllProduct(){
    this.api.getProduct()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort=this.sort
      },
      error:(err)=>{
        alert("Error while fetching the records!!!");
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getAllProduct();
  }
}
