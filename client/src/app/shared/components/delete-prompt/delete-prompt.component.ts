import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-delete-prompt',
    imports: [],
    templateUrl: './delete-prompt.component.html',
    styleUrl: './delete-prompt.component.css',
})
export class DeletePromptComponent {
    @Input({ }) deleteFunc!: () => void

    @Output() cancel = new EventEmitter<void>();

    onCancel() {
        this.cancel.emit()
    }
}
