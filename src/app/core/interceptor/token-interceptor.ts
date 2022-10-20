import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export class TokenInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({
            setHeaders:{
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJsMDBwaW5maW5pdHk2IiwiaWF0IjoxNjY2MjE0OTI5LCJleHAiOjE2NjY4MTk3Mjl9.R744cMf0G0bYL0wleHuK2uusprWysdGkNRzQyhieCbPk9cuG5atG80AXdiIwwGuqeTDgI5xQVWQmTJ1IGOW9LQ`
            }
        });
        return next.handle(req);
    }    
}
