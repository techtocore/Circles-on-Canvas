import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Part1Component } from 'src/app/part1/part1.component';
import { Part2Component } from 'src/app/part2/part2.component';

const routes: Routes = [
  { path: 'part1', component: Part1Component },
  { path: 'part2', component: Part2Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
