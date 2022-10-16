import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders:{
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjY1NDIwMjA0LCJleHAiOjE2NjYwMjUwMDR9.g5MWpn3D_vglze_sJ3j7OLQtvTuKUd1x1KH-y1y0iXObgiI86WllAJAj7DjcPlwi5H-QxqiWHxW7UHiQfSvboQ`
            }
        });
        return next.handle(req);
    }    
}
