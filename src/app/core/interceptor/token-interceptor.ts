import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = sessionStorage.getItem('devvsapeAccessToken');

        if(accessToken){
            const cloned = req.clone({
                headers:req.headers.set("Authorization","Bearer " + accessToken)
            });
            return next.handle(cloned);
        }else{
            return next.handle(req);
        }
    }    
}
