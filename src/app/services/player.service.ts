import { Injectable } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Player } from '../interfaces/player';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private playersDb: AngularFireList<Player>; // Hace referencia la database que vamos a tener en firebase. Es una coleccion de players

  constructor(private db: AngularFireDatabase) {
    this.playersDb = this.db.list('/players', ref => ref.orderByChild('name'));
    // 1er parametro: de que tabla dentro de firebase vamos a utilizar los datos
    // 2do parametro se crea una referencia
    // Idea: Se accede a la base de datos (this.db.list) dentro de los jugadores(1er parametro '/players') y se implementa la funcionalidad con ref que es de ordenar por nombre
  }

  getPlayers(): Observable<Player[]> { //Funcion para obtencion de datos
    return this.playersDb.snapshotChanges().pipe(
      map(changes =>{
        return changes.map( c => ({ $key: c.payload.key, ...c.payload.val()}));
      })
    );
  }

  //el snapshotChanges lo que hace es obtener un snapshot(instantanea) change(cambio) de la informacion
  // en un momento dado que es cuando pedimos la informacion(pipe)

  addPlayer(player: Player){
    return this.playersDb.push(player);
  }

  deletePlayer(id: string){
    this.db.list('/players').remove(id);
  }

  editPlayer(newPlayerData){
    const $key = newPlayerData.$key;
    delete(newPlayerData.$key);
    this.db.list('/players').update($key,newPlayerData);
  }

}
