import { Component, OnInit } from '@angular/core';
import { Publisher, Heroe } from '../../interfaces/heroes.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../components/confirm/confirm.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    img{
      width: 100%;
      border-radius: 5px;
    }
    `
  ]
})
export class AgregarComponent implements OnInit {

  publisher = Publisher;

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('editar')) return;
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroePorId(id)))
      .subscribe(heroe => this.heroe = heroe);
  }

  guardar() {
    if (this.heroe.superhero.trim().length === 0) return;
    if (this.heroe.id) {
      // Actualizar
      this.heroesService.putHeroe(this.heroe)
        .subscribe(() => this.mostrarSnackBar("Se ha editado con exito"))
    } else {
      // Crear
      this.heroesService.postHeroe(this.heroe)
        .subscribe(heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnackBar("Se ha guardado con exito");
        })
    }
  }

  borrar() {
    const dialog = this.dialog.open(ConfirmComponent, {
      data: { ...this.heroe }
    });
    dialog.afterClosed()
      .subscribe(result => {
        if (result)
          this.heroesService.deleteHeroe(this.heroe.id!)
            .subscribe(() => {
              this.router.navigate(['/heroes']);
              this.mostrarSnackBar("Se ha eliminado con exito");
            })
      });
  }

  mostrarSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, 'Cerrar', {
      duration: 2500
    })
  }
}
