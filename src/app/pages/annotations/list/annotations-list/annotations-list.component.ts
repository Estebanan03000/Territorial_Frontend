import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { Annotation } from 'src/app/models/annotation';
import { Neighborhood } from 'src/app/models/neighborhood';

import { AnnotationsService } from 'src/app/services/annotations.service';
import { AnnotationImageService } from 'src/app/services/annotation-image.service';
import { NeighborhoodsService } from 'src/app/services/neighborhoods.service';

import { DynamicTableComponent } from 'src/app/components/ui/table/dynamic-table/dynamic-table.component';

import { ColumnDef } from 'src/app/models/component-dynamic-table/column-def';
import { ActionButton } from 'src/app/models/component-dynamic-table/action-button';
import { TablePageEvent } from 'src/app/models/component-dynamic-table/table-page-event';

import { Vote } from 'src/app/models/vote';
import { VotesService } from 'src/app/services/votes.service';

type AnnotationRow = Annotation & {
  neighborhoodName?: string;
};

@Component({
  selector: 'app-annotations-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DynamicTableComponent
  ],
  templateUrl: './annotations-list.component.html',
  styleUrl: './annotations-list.component.scss',
})
export class AnnotationsListComponent implements OnInit {

  annotations: AnnotationRow[] = [];

  neighborhoods: Neighborhood[] = [];

  votes: Vote[] = [];

  loading = false;

  page = 1;
  pageSize = 5;
  total = 0;
  totalPages = 1;

  columns: ColumnDef[] = [
    { header: 'Evidencia',  key: 'hasImage' },
    { header: 'Descripción', key: 'description' },
    { header: 'Barrio', key: 'neighborhoodName' },
    { header: 'Latitud', key: 'latitude' },
    { header: 'Longitud', key: 'longitude' },
    { header: 'Estado', key: 'status' },
    { header: 'Calificación', key: 'ratingDisplay' }
  ];

  actions: ActionButton[] = [
    {
      id: 'rate',
      label: '⭐ Calificar',
      class: 'mr-2 px-2 py-1 rounded bg-blue-500 text-white'
    },
    {
      id: 'votes',
      label: '👁 Ver votos',
      class: 'mr-2 px-2 py-1 rounded bg-indigo-500 text-white'
    },
    {
      id: 'edit',
      label: 'Editar',
      class: 'mr-2 px-2 py-1 rounded bg-yellow-400 text-black'
    },
    {
      id: 'delete',
      label: 'Eliminar',
      class: 'mr-2 px-2 py-1 rounded bg-red-500 text-white'
    }
  ];

  constructor(
    private annotationsService: AnnotationsService,
    private annotationImageService: AnnotationImageService,
    private neighborhoodsService: NeighborhoodsService,
    private router: Router,
    private votesService: VotesService,
  ) {}

  ngOnInit(): void {

    this.votesService.getAll().subscribe({

      next: (votes) => {

        this.votes = votes || [];

        this.loadInitialData();

      },

      error: () => {

        this.votes = [];

        this.loadInitialData();

      }

    });

  }

  loadInitialData(): void {

    this.neighborhoodsService.getAll().subscribe({

      next: (data) => {

        this.neighborhoods = data || [];

        this.loadAnnotations();

      },

      error: () => {

        this.neighborhoods = [];

        this.loadAnnotations();

      }

    });

  }

  loadAnnotations(
    page = this.page,
    pageSize = this.pageSize
  ): void {

    this.votesService.getAll().subscribe({
      next: (votes) => {
        console.log('VOTOS', votes);
      }
    });

    this.loading = true;

    this.annotationsService
      .getPaged(page, pageSize)
      .subscribe({

        next: (resp) => {

          this.annotations =
            (resp.items || []).map(item => ({

              ...item,

              neighborhoodName:
                this.getNeighborhoodName(
                  item.id_neighborhood
                ),

              hasImage:
                item.id_annotation &&
                this.annotationImageService.getImage(
                  item.id_annotation
                )
                  ? 'Registrada'
                  : 'No registrada',

              ratingDisplay:
                this.getVoteCount(
                  item.id_annotation
                ) > 0
                  ? `⭐ ${this.getAverageRating(
                      item.id_annotation
                    )} (${this.getVoteCount(
                      item.id_annotation
                    )})`
                  : 'Sin votos'

            }));

          this.page = page;
          this.pageSize = pageSize;
          this.total = resp.totalItems ?? 0;
          this.totalPages =
            resp.totalPages ?? 1;

          this.loading = false;

        },

        error: () => {

          this.annotations = [];

          this.loading = false;

        }

      });

  }

  getNeighborhoodName(
    idNeighborhood?: number | null
  ): string {

    const neighborhood =
      this.neighborhoods.find(
        n =>
          n.id_neighborhood ===
          idNeighborhood
      );

    return neighborhood?.name || '-';

  }

  getAverageRating(
    annotationId?: number
  ): number {

    const votes =
      this.votes.filter(
        v =>
          v.id_annotation ===
          annotationId
      );

    if (votes.length === 0) {
      return 0;
    }

    const total =
      votes.reduce(
        (sum, vote) =>
          sum + (vote.stars || 0),
        0
      );

    return Number(
      (total / votes.length)
        .toFixed(1)
    );

  }

  getVoteCount(
    annotationId?: number
  ): number {

    return this.votes.filter(
      v =>
        v.id_annotation ===
        annotationId
    ).length;

  }

  onPageChange(
    event: TablePageEvent
  ): void {

    this.loadAnnotations(
      event.page,
      event.pageSize
    );

  }

  onTableAction(event: any): void {

    const row = event.row;

    if (event.actionId === 'rate') {

      this.rateAnnotation(row);

    }

    if (event.actionId === 'votes') {

      this.showVotes(event.row);

    }

    if (event.actionId === 'edit') {

      this.router.navigate([
        `/annotations/update/${row.id_annotation}`
      ]);

    }

    if (event.actionId === 'delete') {

      this.deleteAnnotation(
        row.id_annotation
      );

    }

  }

  deleteAnnotation(id?: number): void {

    if (!id) return;

    Swal.fire({
      title: '¿Eliminar anotación?',
      icon: 'warning',
      showCancelButton: true
    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      this.annotationsService
        .delete(id)
        .subscribe({

          next: () => {

            Swal.fire(
              'Eliminada',
              '',
              'success'
            );

            this.loadAnnotations();

          }

        });

    });

  }

  rateAnnotation(row: any): void {

    Swal.fire({

      title: 'Calificar anotación',

      html: `

        <label>
          Estrellas (1-5)
        </label>

        <input
          id="stars"
          type="number"
          min="1"
          max="5"
          value="5"
          class="swal2-input">

        <textarea
          id="comment"
          class="swal2-textarea"
          placeholder="Comentario">
        </textarea>

      `,

      showCancelButton: true,

      confirmButtonText: 'Guardar'

    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }

      const starsInput =
        document.getElementById('stars') as HTMLInputElement;

      const stars =
        Number(starsInput?.value || 0);

      const commentInput =
        document.getElementById('comment') as HTMLTextAreaElement;

      const comment =
        commentInput?.value || '';

      const vote: Partial<Vote> = {

        id_annotation:
          row.id_annotation,

        id_citizen: 1,

        stars,

        comment

      };

      console.log('VOTO A ENVIAR:', vote);

      this.votesService
        .search(
          {
            id_annotation: row.id_annotation,
            id_citizen: 1
          },
          1,
          100
        )
        .subscribe({

          next: (response: any) => {

            const existingVote =
              response.items?.[0];

            if (existingVote) {

              this.votesService
                .update(
                  existingVote.id_vote,
                  vote
                )
                .subscribe({

                  next: () => {

                    Swal.fire(
                      'Calificación actualizada',
                      '',
                      'success'
                    );

                    this.votesService.getAll().subscribe({
                      next: (votes) => {
                        this.votes = votes;
                        this.loadAnnotations();
                      }
                    });

                  },

                  error: (error) => {

                    console.error(error);

                  }

                });

            } else {

              this.votesService
                .create(vote)
                .subscribe({

                  next: () => {

                    Swal.fire(
                      'Calificación registrada',
                      '',
                      'success'
                    );

                    this.votesService.getAll().subscribe({
                      next: (votes) => {
                        this.votes = votes;
                        this.loadAnnotations();
                      }
                    });

                  },

                  error: (error) => {

                    console.error(error);

                  }

                });

            }

          },

          error: (error) => {

            console.error(error);

          }

        });

    });

  }

  showVotes(row: any): void {

    const votes =
      this.votes.filter(
        v =>
          v.id_annotation ===
          row.id_annotation
      );

    if (votes.length === 0) {

      Swal.fire({
        icon: 'info',
        title: 'Sin votos',
        text: 'Esta anotación aún no tiene votos'
      });

      return;
    }

    let html = '';

    votes.forEach(vote => {

      const stars =
        '⭐'.repeat(vote.stars || 0);

      html += `
        <div
          style="
            text-align:left;
            margin-bottom:15px;
            padding:10px;
            border-bottom:1px solid #ddd;
          "
        >
          <b>${stars}</b><br>

          <small>
            Ciudadano:
            ${vote.id_citizen}
          </small>

          <br><br>

          ${
            vote.comment
              ? vote.comment
              : '<i>Sin comentario</i>'
          }

        </div>
      `;

    });

    Swal.fire({

      title: 'Votos de la anotación',

      html,

      width: 700

    });

  }

}
