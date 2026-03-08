import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductList } from '../components/product-list/product-list';
import { Login } from '../components/login/login';
import { Register } from '../components/register/register';
import { Dashboard } from '../components/dashboard/dashboard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard },
  { path: 'product-list', component: ProductList },
  { path: 'login', component: Login },
  { path: 'register', component: Register }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
