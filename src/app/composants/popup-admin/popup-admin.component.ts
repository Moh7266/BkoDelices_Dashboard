import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-popup-admin',
  templateUrl: './popup-admin.component.html',
  styleUrls: ['./popup-admin.component.css']
})
export class PopupAdminComponent {

  @Output() buttonClicked = new EventEmitter<string>();

  onButtonClicked(buttonName: string) {
    this.buttonClicked.emit(buttonName);
  }

}
