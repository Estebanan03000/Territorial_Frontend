import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CitizensService } from 'src/app/services/citizens.service';
import { Citizen } from 'src/app/models/citizen';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-detail-citizen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-citizen.component.html',
  styleUrl: './detail-citizen.component.scss'
})
export class DetailCitizenComponent implements OnInit {

  citizen?: Citizen;
  loading = false;

  private map?: L.Map;
  private mapLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citizensService: CitizensService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.router.navigate(['/citizens/list']);
      return;
    }

    this.loading = true;

    this.citizensService.getById(id).subscribe({
      next: (citizen) => {
        this.citizen = citizen;
        this.loading = false;

        setTimeout(() => {
          const container = document.getElementById('citizen-detail-map');
          if (container) {
            this.initMap();
          }
        }, 100);
      },
    });
  }


  private initMap(): void {
    if (this.mapLoaded || !this.citizen) return;

    const lat = this.citizen.latitude ?? 5.0703;
    const lng = this.citizen.longitude ?? -75.5138;

    this.map = L.map('citizen-detail-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.citizen.latitude && this.citizen.longitude) {
      L.marker([this.citizen.latitude, this.citizen.longitude]).addTo(this.map);
    }

    this.mapLoaded = true;
  }

  goBack(): void {
    this.router.navigate(['/citizens/list']);
  }

  goEdit(): void {
    if (this.citizen?.id_citizen) {
      this.router.navigate(['/citizens/update', this.citizen.id_citizen]);
    }
  }
}