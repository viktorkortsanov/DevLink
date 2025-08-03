import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../user/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    
    const currentUser = authService.currentUser();

    if (currentUser) {
        return true;
    }

    router.navigate(['/sign-in']);
    return false;
};