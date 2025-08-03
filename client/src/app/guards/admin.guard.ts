import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../user/auth.service";

export const adminGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    
    const currentUser = authService.currentUser();

    if (currentUser?.isAdmin) {
        return true;
    }

    router.navigate(['/']);
    return false;
};