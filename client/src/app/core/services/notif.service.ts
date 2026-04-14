import { computed, Injectable, signal } from '@angular/core';
import { Notification } from '../../shared/interfaces/notification';

@Injectable({
    providedIn: 'root',
})
export class Notif {

    private notificationSignal = signal<Notification | null>(null);
    private timeoutId: ReturnType<typeof setTimeout> | null = null;

    notification = computed(() => this.notificationSignal())

    private setNotif(notification: Notification): void {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.notificationSignal.set(notification);

        this.timeoutId = setTimeout(() => {
            this.notificationSignal.set(null);
            this.timeoutId = null
        }, 5000)
    }

    setSuccessMessage(message: string): void {
        if (!message) {
            return;
        }

        this.setNotif({message, type: 'success'});
    }

    setErrorMessage(message: string): void {
        if (!message) {
            return;
        }
        
        this.setNotif({message, type: 'error'});
    }
}
