import { Error } from './error.model';
import { EventEmitter } from '@angular/core';

export class ErrorService {
    errorOccurred = new EventEmitter<Error>();

    handleError(error: any) {
        if (error) {
            const errorData = new Error(error.title, error.error.message);
            this.errorOccurred.emit(errorData);
        }
    }
}
