import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecurityService } from '../../../services/security.service';
import { User } from '../../../models/user';
import Swal from 'sweetalert2';

import {
          GoogleAuthProvider,
          GithubAuthProvider,
          signInWithPopup
        } from 'firebase/auth';
import { firebaseAuth } from 'src/app/firebase.config';

@Component({
  selector: 'app-side-login',
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  error: string | null = null;
  loading = false;

  constructor(
    private router: Router,
    private security: SecurityService,
  ) {}

  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.error = null;
    this.loading = true;

    const user: User = {
      email: this.f.email.value ?? undefined,
      password: this.f.password.value ?? undefined,
    };

    this.security.login(user).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || '';
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.',
        });
      }
    });
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(firebaseAuth, provider);

      const token = await result.user.getIdToken();

      console.log('========== FIREBASE GOOGLE USER ==========');
      console.log(result.user);

      console.log('========== FIREBASE GOOGLE TOKEN ==========');
      console.log(token);

      localStorage.setItem('google_token', token);

      const simulatedUser: User = {
        email: result.user.email ?? undefined,
        name: result.user.displayName ?? undefined,
      } as User;

      this.security.setUser(simulatedUser);

      Swal.fire({
        icon: 'success',
        title: 'Login con Google exitoso',
        text: 'Token mostrado en consola y guardado en localStorage.',
      });

      this.router.navigate(['']);
    } catch (error) {
      console.error('Error Google Firebase:', error);

      Swal.fire({
        icon: 'error',
        title: 'Error con Google',
        text: 'No se pudo iniciar sesión con Google.',
      });
    }
  }

  loginWithMicrosoft(): void {

    Swal.fire({
      icon: 'info',
      title: 'Microsoft OAuth',
      text:
        'Requiere configuración de Microsoft Entra ID.'
    });

  }

  async loginWithGithub(): Promise<void> {

    try {

      const provider = new GithubAuthProvider();

      const result = await signInWithPopup(
        firebaseAuth,
        provider
      );

      const credential =
        GithubAuthProvider.credentialFromResult(result);

      console.log(
        '========== GITHUB USER =========='
      );

      console.log(result.user);

      console.log(
        '========== GITHUB ACCESS TOKEN =========='
      );

      console.log(
        credential?.accessToken
      );

      if (credential?.accessToken) {

        localStorage.setItem(
          'github_token',
          credential.accessToken
        );

      }

      const simulatedUser: User = {
        email:
          result.user.email ?? undefined,

        name:
          result.user.displayName ?? undefined,
      } as User;

      this.security.setUser(
        simulatedUser
      );

      Swal.fire({
        icon: 'success',
        title: 'GitHub Login',
        text: 'Autenticación exitosa'
      });

      this.router.navigate(['']);

    }
    catch (error) {

      console.error(
        'GitHub Error',
        error
      );

      Swal.fire({
        icon: 'error',
        title: 'GitHub Error',
        text: 'No fue posible autenticarse'
      });

    }

  }
}
