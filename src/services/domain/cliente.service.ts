import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { ClienteDTO } from "../../models/cliente.dto";
import { API_CONFIG } from "../../configs/api.config";
import { StorageService } from "../storage.service";
import { ImageUtilService } from "../image-util.service";
import { AngularFireStorage, AngularFireUploadTask } from "@angular/fire/storage";

@Injectable()
export class ClienteService {

    constructor(
        public http: HttpClient,
        public storage: StorageService,
        public imageUtilService: ImageUtilService,
        private fireStorage: AngularFireStorage
    ) {
    }

    findById(id: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/${id}`);
    }

    findByEmail(email: string) {
        return this.http.get(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`);
    }

    getImageFromBucket(id: string): Observable<any> {

        let url = `${API_CONFIG.bucketClientes}/cp${id}.jpg`
        return this.http.get(url, { responseType: 'blob' });
    }

    insert(obj: ClienteDTO) {
        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }

    uploadPicture(picture, cliente) {

        //Configura arquivo para ser enviado para o backend
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture);
        let formData: FormData = new FormData();
        formData.set('file', pictureBlob, 'file.png');

        //Salva arquivo no Firebase Storage
        const ref = this.fireStorage.ref('clientes/cp' + cliente.id);
        const task: AngularFireUploadTask = ref.put(pictureBlob)

        return this.http.post(
            `${API_CONFIG.baseUrl}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        );
    }
}

