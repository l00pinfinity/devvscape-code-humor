import { AbstractControl, ValidationErrors } from "@angular/forms";

export class WhitespaceValidators {
    static cannotContainWhitespace(control:AbstractControl):ValidationErrors | null {
        if((control.value as string).indexOf(' ') >= 0) {
            return {cannotContainWhitespace:true}
        }
        return null;
    }
}
