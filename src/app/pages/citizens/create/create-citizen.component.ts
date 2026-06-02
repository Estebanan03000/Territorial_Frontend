import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CitizenFormComponent } from '../components/citizen-form/citizen-form.component';
import { CitizensService } from 'src/app/services/citizens.service';
import { Citizen } from 'src/app/models/citizen';

@Component({
  selector: 'app-create-citizen',
  standalone: true,
  imports: [CitizenFormComponent],
  templateUrl: './create-citizen.component.html',
  styleUrl: './create-citizen.component.scss'
})
export class CreateCitizenComponent {

  loading = false;

  constructor(
    private router: Router,
    private citizensService: CitizensService
  ) {}

  onCreate(formValue: Partial<Citizen>): void {
    this.loading = true;

    this.citizensService.create(formValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/citizens/list']);
      },
      error: () => {
        this.loading = false;
        alert('No se pudo crear el ciudadano.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/citizens/list']);
  }
}