import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.css'],
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule]
})
export class OrderDetailsModalComponent {
  @Input() orderDetails: any;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(private datePipe: DatePipe) {}

  closeModal(): void {
    this.close.emit();
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'short') || '';
  }
}
