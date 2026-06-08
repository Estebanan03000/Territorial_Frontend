import { Annotation } from './annotation';
import { AnnotationCategory } from './annotation-category';
import { Category } from './category';
import { Citizen } from './citizen';
import { Commune } from './commune';
import { Evidence } from './evidence';
import { Neighborhood } from './neighborhood';
import { Vote } from './vote';

export type AnnotationMapViewMode = 'markers' | 'heat';

export interface AnnotationMapFilters {
  id_commune?: number;
  id_neighborhood?: number;
  search?: string;
  categoryIds: number[];
  viewMode: AnnotationMapViewMode;
}

export interface AnnotationMapItem {
  annotation: Annotation;
  neighborhood?: Neighborhood;
  commune?: Commune;
  citizen?: Citizen;
  categories: Category[];
  annotationCategories: AnnotationCategory[];
  evidences: Evidence[];
  votes: Vote[];
  mainCategory?: Category;
  subcategory?: Category;
  averageRating: number;
  voteCount: number;
}

export interface AnnotationCategoryCount {
  category: Category;
  count: number;
  children: AnnotationCategoryCount[];
}
