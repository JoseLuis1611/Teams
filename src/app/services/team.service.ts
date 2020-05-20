import { Injectable } from '@angular/core';
import { Team } from '../interfaces/team';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { Player } from '../interfaces/player';
import { map } from 'rxjs/operators';

export const TeamTableHeaders = ['Name','Country','Players']
//Creamos el objeto con las cabeceras de la tabla.

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsDb: AngularFireList<Team>;

  constructor(private db: AngularFireDatabase) {
    this.teamsDb = this.db.list('/teams', ref => ref.orderByChild('name'));
  }

  getTeams(): Observable<Team[]> { //Funcion para obtencion de datos
    return this.teamsDb.snapshotChanges().pipe(
      map(changes =>{
        return changes.map( c => ({ key: c.payload.key, ...c.payload.val()}));
      })
    );
  }

  addTeam(team: Team){
    return this.teamsDb.push(team);
  }

  deleteTeam(id: string){
    this.db.list('/teams').remove(id);
  }

  editTeam(newPlayerData){
    const key = newPlayerData.key;
    delete(newPlayerData.key);
    this.db.list('/teams').update(key,newPlayerData);
  }
}
