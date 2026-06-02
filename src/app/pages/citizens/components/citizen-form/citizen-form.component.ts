import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Citizen } from 'src/app/models/citizen';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: 'assets/leaflet/marker-icon.png',
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-citizen-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citizen-form.component.html',
  styleUrl: './citizen-form.component.scss'
})
export class CitizenFormComponent implements OnInit, AfterViewInit {

  @Input() citizen?: Citizen;
  @Input() buttonText = 'Guardar ciudadano';
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<Partial<Citizen>>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  private map?: L.Map;
  private marker?: L.Marker;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.citizen?.name ?? '', Validators.required],
      email: [this.citizen?.email ?? '', [Validators.required, Validators.email]],
      phone: [this.citizen?.phone ?? '', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
      address: [this.citizen?.address ?? '', Validators.required],
      latitude: [this.citizen?.latitude ?? null, Validators.required],
      longitude: [this.citizen?.longitude ?? null, Validators.required],
      status: [this.citizen?.status ?? 'active', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  private initMap(): void {
    const lat = this.form.value.latitude ?? 5.0703;
    const lng = this.form.value.longitude ?? -75.5138;

    this.map = L.map('citizen-map').setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    if (this.form.value.latitude && this.form.value.longitude) {
      this.setMarker(this.form.value.latitude, this.form.value.longitude);
    }

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const selectedLat = event.latlng.lat;
      const selectedLng = event.latlng.lng;

      this.form.patchValue({
        latitude: selectedLat,
        longitude: selectedLng
      });

      this.setMarker(selectedLat, selectedLng);
      this.getAddressFromCoordinates(selectedLat, selectedLng);
    });
  }

  private setMarker(lat: number, lng: number): void {
    if (!this.map) return;

    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
    } else {
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }

  private getAddressFromCoordinates(lat: number, lng: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        const a = data.address || {};

        const road = a.road || a.pedestrian || a.footway || a.path || '';
        const houseNumber = a.house_number || '';
        const neighbourhood = a.neighbourhood || a.suburb || a.quarter || '';
        const city = a.city || a.town || a.village || 'Manizales';

        const shortAddress = [
          road && houseNumber ? `${road} # ${houseNumber}` : road,
          neighbourhood,
          city
        ]
          .filter(Boolean)
          .join(', ');

        this.form.patchValue({
          address: shortAddress || data.display_name || `${lat}, ${lng}`
        });
      })
      .catch(() => {
        this.form.patchValue({
          address: `${lat}, ${lng}`
        });
      });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && control.touched;
  }

  clearLocation(): void {
    this.form.patchValue({
      latitude: null,
      longitude: null,
      address: ''
    });

    if (this.map && this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = undefined;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit({
      ...this.citizen,
      ...this.form.value
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}