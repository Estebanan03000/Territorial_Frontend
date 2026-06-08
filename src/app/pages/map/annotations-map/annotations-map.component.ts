import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';

import { Annotation } from 'src/app/models/annotation';
import { AnnotationCategory } from 'src/app/models/annotation-category';
import { AnnotationMapFilters, AnnotationMapItem, AnnotationMapViewMode } from 'src/app/models/annotation-map-item';
import { Category } from 'src/app/models/category';
import { Citizen } from 'src/app/models/citizen';
import { Commune } from 'src/app/models/commune';
import { Evidence } from 'src/app/models/evidence';
import { Neighborhood } from 'src/app/models/neighborhood';
import { Point } from 'src/app/models/point';
import { Vote } from 'src/app/models/vote';

import { AnnotationsService } from 'src/app/services/annotations.service';
import { AnnotationCategoriesService } from 'src/app/services/annotation-categories.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { CitizensService } from 'src/app/services/citizens.service';
import { CommunesService } from 'src/app/services/communes.service';
import { EvidencesService } from 'src/app/services/evidences.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';
import { PointsService } from 'src/app/services/points.service';
import { VotesService } from 'src/app/services/votes.service';

import { AnnotationsMapComponent } from 'src/app/components/maps/annotations-map/annotations-map.component';
import { AnnotationCategoryFilterComponent } from '../components/annotation-category-filter/annotation-category-filter.component';
import { AnnotationDetailPanelComponent } from '../components/annotation-detail-panel/annotation-detail-panel.component';
import { AnnotationMapLegendComponent } from '../components/annotation-map-legend/annotation-map-legend.component';
import { AnnotationMapSummaryComponent } from '../components/annotation-map-summary/annotation-map-summary.component';
import { AnnotationMapToolbarComponent } from '../components/annotation-map-toolbar/annotation-map-toolbar.component';

@Component({
  selector: 'app-annotations-map-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    AnnotationsMapComponent,
    AnnotationCategoryFilterComponent,
    AnnotationDetailPanelComponent,
    AnnotationMapLegendComponent,
    AnnotationMapSummaryComponent,
    AnnotationMapToolbarComponent,
  ],
  templateUrl: './annotations-map.component.html',
  styleUrl: './annotations-map.component.scss',
})
export class AnnotationsMapPageComponent implements OnInit {
  @ViewChild(AnnotationsMapComponent) mapComponent?: AnnotationsMapComponent;

  annotations: Annotation[] = [];
  annotationCategories: AnnotationCategory[] = [];
  categories: Category[] = [];
  citizens: Citizen[] = [];
  communes: Commune[] = [];
  evidences: Evidence[] = [];
  neighborhoods: Neighborhood[] = [];
  points: Point[] = [];
  votes: Vote[] = [];

  items: AnnotationMapItem[] = [];
  filteredItems: AnnotationMapItem[] = [];
  selectedItem?: AnnotationMapItem;

  selectedCategoryIds: number[] = [];
  viewMode: AnnotationMapViewMode = 'markers';
  selectedNeighborhoodId?: number;
  loading = false;

  constructor(
    private annotationsService: AnnotationsService,
    private annotationCategoriesService: AnnotationCategoriesService,
    private categoriesService: CategoriesService,
    private citizensService: CitizensService,
    private communesService: CommunesService,
    private evidencesService: EvidencesService,
    private neighborhoodsService: NeighborhoodsService,
    private pointsService: PointsService,
    private votesService: VotesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    forkJoin({
      annotations: this.annotationsService.search({}, 1, 1000),
      annotationCategories: this.annotationCategoriesService.search({}, 1, 1000),
      categories: this.categoriesService.search({}, 1, 1000),
      citizens: this.citizensService.search({}, 1, 1000),
      communes: this.communesService.search({}, 1, 1000),
      evidences: this.evidencesService.search({}, 1, 1000),
      neighborhoods: this.neighborhoodsService.search({}, 1, 1000),
      points: this.pointsService.search({}, 1, 1000),
      votes: this.votesService.search({}, 1, 1000),
    }).subscribe({
      next: (response) => {
        this.annotations = response.annotations.items;
        this.annotationCategories = response.annotationCategories.items;
        this.categories = response.categories.items;
        this.citizens = response.citizens.items;
        this.communes = response.communes.items;
        this.evidences = response.evidences.items;
        this.neighborhoods = response.neighborhoods.items;
        this.points = response.points.items;
        this.votes = response.votes.items;

        this.items = this.buildMapItems();
        this.filteredItems = this.items;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  buildMapItems(): AnnotationMapItem[] {
    return this.annotations.map((annotation) => {
      const neighborhood = this.neighborhoods.find((item) => item.id_neighborhood === annotation.id_neighborhood);
      const commune = this.communes.find((item) => item.id_commune === neighborhood?.id_commune);
      const citizen = this.citizens.find((item) => item.id_citizen === annotation.id_citizen);
      const annotationCategories = this.annotationCategories.filter((item) => item.id_annotation === annotation.id_annotation);
      const categories = annotationCategories
        .map((item) => this.categories.find((category) => category.id_category === item.id_category))
        .filter((item): item is Category => !!item);
      const evidences = this.evidences.filter((item) => item.id_annotation === annotation.id_annotation);
      const votes = this.votes.filter((item) => item.id_annotation === annotation.id_annotation);
      const averageRating = this.calculateAverage(votes);
      const mainCategory = this.getMainCategory(categories);
      const subcategory = this.getSubcategory(categories);

      return {
        annotation,
        neighborhood,
        commune,
        citizen,
        categories,
        annotationCategories,
        evidences,
        votes,
        mainCategory,
        subcategory,
        averageRating,
        voteCount: votes.length,
      };
    });
  }

  applyFilters(filters: AnnotationMapFilters): void {
    this.viewMode = filters.viewMode;
    this.selectedCategoryIds = filters.categoryIds;
    this.selectedNeighborhoodId = filters.id_neighborhood;

    const search = (filters.search || '').toLowerCase().trim();

    this.filteredItems = this.items.filter((item) => {
      if (filters.id_commune && item.commune?.id_commune !== filters.id_commune) {
        return false;
      }

      if (filters.id_neighborhood && item.neighborhood?.id_neighborhood !== filters.id_neighborhood) {
        return false;
      }

      if (filters.categoryIds.length > 0) {
        const itemCategoryIds = item.categories.map((category) => Number(category.id_category));
        const hasCategory = filters.categoryIds.some((id) => itemCategoryIds.includes(id));

        if (!hasCategory) {
          return false;
        }
      }

      if (search) {
        const text = [
          item.annotation.description,
          item.neighborhood?.name,
          item.commune?.name,
          item.citizen?.name,
          item.mainCategory?.name,
          item.subcategory?.name,
        ]
          .join(' ')
          .toLowerCase();

        return text.includes(search);
      }

      return true;
    });

    if (this.selectedItem && !this.filteredItems.some((item) => item.annotation.id_annotation === this.selectedItem?.annotation.id_annotation)) {
      this.selectedItem = undefined;
    }
  }

  updateSelectedCategories(ids: number[]): void {
    this.selectedCategoryIds = ids;
    this.applyFilters({
      categoryIds: ids,
      viewMode: this.viewMode,
    });
  }

  selectAnnotation(item: AnnotationMapItem): void {
    this.selectedItem = item;
    this.selectedNeighborhoodId = item.neighborhood?.id_neighborhood;
  }

  locateAnnotation(item: AnnotationMapItem): void {
    this.selectedItem = item;
    this.mapComponent?.focusAnnotation(item);
  }

  saveVote(event: { item: AnnotationMapItem; stars: number; comment: string }): void {
    const idCitizen = event.item.annotation.id_citizen;

    if (!idCitizen || !event.item.annotation.id_annotation) {
      Swal.fire('Error', 'La anotación no tiene ciudadano asociado.', 'error');
      return;
    }

    this.votesService.create({
      id_citizen: idCitizen,
      id_annotation: event.item.annotation.id_annotation,
      stars: event.stars,
      comment: event.comment,
    }).subscribe({
      next: () => {
        Swal.fire('Guardado', 'La calificación fue registrada.', 'success');
        this.loadData();
      },
      error: (error) => {
        Swal.fire('Error', this.getErrorMessage(error), 'error');
      },
    });
  }

  calculateAverage(votes: Vote[]): number {
    if (votes.length === 0) {
      return 0;
    }

    const total = votes.reduce((sum, vote) => sum + Number(vote.stars || 0), 0);
    return total / votes.length;
  }

  getMainCategory(categories: Category[]): Category | undefined {
    const directParent = categories.find((item) => !item.id_parent_category);

    if (directParent) {
      return directParent;
    }

    const child = categories.find((item) => item.id_parent_category);
    return this.categories.find((item) => item.id_category === child?.id_parent_category);
  }

  getSubcategory(categories: Category[]): Category | undefined {
    return categories.find((item) => !!item.id_parent_category) || categories[0];
  }

  getErrorMessage(error: any): string {
    return error?.error?.message || 'No fue posible completar la operación.';
  }
}
