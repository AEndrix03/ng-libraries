import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ar-background-decor',
  templateUrl: './background-decor.component.html',
  styleUrls: ['./background-decor.css', '../../styles/animations.css'],
  encapsulation: ViewEncapsulation.None,
})
export class BackgroundDecorComponent {
  @Input() onlyIcons: boolean = false;
}
