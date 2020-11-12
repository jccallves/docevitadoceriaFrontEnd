import { Observable } from "rxjs";
import { observableToBeFn } from "rxjs/testing/TestScheduler";

export interface ClienteDTO {
    id : string;
    nome : string;
    email : string;
    senha : string;
    imageUrl? : Observable<string>;

}