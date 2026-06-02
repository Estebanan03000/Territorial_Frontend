import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CitizenFormComponent } from '../components/citizen-form/citizen-form.component';
import { CitizensService } from 'src/app/services/citizens.service';
import { Citizen } from 'src/app/models/citizen';

@Component({
  selector: 'app-update-citizen',
  standalone: true,
  imports: [CitizenFormComponent],
  templateUrl: './update-citizen.component.html',
  styleUrl: './update-citizen.component.scss'
})
export class UpdateCitizenComponent implements OnInit {

  citizen?: Citizen;
  loading = false;
  private id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citizensService: CitizensService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : NaN;

    if (isNaN(this.id)) {
      this.router.navigate(['/citizens/list']);
      return;
    }

    this.citizensService.getById(this.id).subscribe({
      next: (citizen) => {
        this.citizen = citizen;
      },
      error: () => {
        this.router.navigate(['/citizens/list']);
      }
    });
  }

  onUpdate(formValue: Partial<Citizen>): void {
    this.loading = true;

    this.citizensService.update(this.id, formValue).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/citizens/list']);
      },
      error: () => {
        this.loading = false;
        alert('No se pudo actualizar el ciudadano.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/citizens/list']);
  }
}