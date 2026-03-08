import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product{
  _id?:string;
  name:string;
  price:number;
  description:string;
}

@Injectable({
  providedIn:'root'
})
export class ProductService{

  private baseUrl="http://localhost:3024/api/products";

  constructor(private http:HttpClient){}

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.baseUrl}/get-all-product`);
  }

  createProduct(product:Product){
    return this.http.post(`${this.baseUrl}/create-product`,product);
  }

  updateProduct(id:string,product:Product){
    return this.http.put(`${`${this.baseUrl}/update-product-by-id`}/${id}`,product);
  }

  deleteProduct(id:string){
    return this.http.delete(`${`${this.baseUrl}/delete-product-by-id`}/${id}`);
  }
}