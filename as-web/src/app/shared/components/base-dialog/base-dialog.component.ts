import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-base-dialog',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.less'
})
export class BaseDialogComponent {
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
