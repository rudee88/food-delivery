import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent  implements OnInit {

  @Input() item: any;
  @Input() index: any;
  @Output() add: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  onQuantityPlus() {
    this.add.emit(this.index);
  }

  onQuantityMinus() {
    this.minus.emit(this.index);
  }

}
