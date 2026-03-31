import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-delete-prompt',
    imports: [],
    templateUrl: './delete-prompt.component.html',
    styleUrl: './delete-prompt.component.css',
})
export class DeletePromptComponent {
    @Input({required: true}) deleteFunc!: () => void
    @Input() itemType!: string

    @Output() cancel = new EventEmitter<void>();

    onCancel() {
        this.cancel.emit()
    }
}
