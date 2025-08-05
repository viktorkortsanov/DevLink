import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginComponent } from './login';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        const authSpy = jasmine.createSpyObj('AuthService', ['login']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [LoginComponent, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute, HttpClient,    
                    useValue: {
                        params: of({}),
                        queryParams: of({}),
                        snapshot: {
                            paramMap: {
                                get: () => null
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
    });


    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.loginForm.get('email')?.value).toBe('');
        expect(component.loginForm.get('password')?.value).toBe('');
        expect(component.errorMessage()).toBe('');
    });

    it('should show error for invalid form', () => {
        component.onLogin();
        expect(component.errorMessage()).toBe('All fields are required');
    });

    it('should validate email format', () => {
        const emailControl = component.loginForm.get('email');
        emailControl?.setValue('invalid-email');
        expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('should validate password length', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('123');
        expect(passwordControl?.hasError('minlength')).toBeTrue();
    });
});