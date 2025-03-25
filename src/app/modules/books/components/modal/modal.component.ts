import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../../../../core/models/book.model';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnInit {
  @Input() book!: Book;
  @Output() onSave = new EventEmitter();
  @Output() onClose = new EventEmitter();
  editedBook!: Book;

  constructor() {}

  ngOnInit(): void {
    this.editedBook = { ...this.book };
  }

  saveChanges() {
    this.onSave.emit(this.editedBook);
  }

  closeModal(event: MouseEvent) {
    this.onClose.emit();
  }

  onEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
