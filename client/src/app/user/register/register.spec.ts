import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, Subject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { RegisterComponent } from './register';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    const eventsSubject = new Subject();

    const routerMock = {
        navigate: jasmine.createSpy('navigate'),
        createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/'),
        serializeUrl: jasmine.createSpy('serializeUrl').and.callFake(url => url),
        get events(): Observable<any> {
            return eventsSubject.asObservable();
        }
    };

    beforeEach(async () => {
        authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule, RegisterComponent],
            providers: [
                { provide: AuthService, useValue: authServiceSpy },
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
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

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with empty form', () => {
        expect(component.registerForm.get('username')?.value).toBe('');
        expect(component.registerForm.get('email')?.value).toBe('');
        expect(component.registerForm.get('password')?.value).toBe('');
        expect(component.registerForm.get('rePassword')?.value).toBe('');
        expect(component.registerForm.get('role')?.value).toBe('');
        expect(component.errorMessage()).toBe('');
    });

    it('should show error for invalid form submission', () => {
        component.onRegister();
        expect(component.errorMessage()).toBe('All fields are required');
    });

    it('should validate email format', () => {
        const emailControl = component.registerForm.get('email');
        emailControl?.setValue('invalid-email');
        expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('should validate username minlength', () => {
        const usernameControl = component.registerForm.get('username');
        usernameControl?.setValue('ab');
        expect(usernameControl?.hasError('minlength')).toBeTrue();
    });

    it('should validate password minlength', () => {
        const passwordControl = component.registerForm.get('password');
        passwordControl?.setValue('123');
        expect(passwordControl?.hasError('minlength')).toBeTrue();
    });

    it('should detect password mismatch and show error', () => {
        component.registerForm.patchValue({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123',
            rePassword: 'different123',
            role: 'developer'
        });

        component.onRegister();
        expect(component.errorMessage()).toBe('Passwords do not match');
    });
});
