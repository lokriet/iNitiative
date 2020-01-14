import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { guid } from '@datorama/akita';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'src/app/messages/state/message.service';

import { EncounterParticipant } from '../../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../../encounter-participant/state/encounter-participant.query';
import { Encounter } from '../../state/encounter.model';
import { EncounterQuery } from '../../state/encounter.query';
import { EncounterService } from '../../state/encounter.service';
import { Map, ParticipantCoordinate } from './state/map.model';
import { MapQuery } from './state/map.query';
import { MapService } from './state/map.service';
import { StringIdGenerator } from './string-id-generator';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewChecked {
  @Input() encounterId: string;
  encounter: Encounter;
  encounterParticipants$: Observable<EncounterParticipant[]>;

  map: Map;
  task: AngularFireUploadTask;
  percentage$: Observable<number>;
  snapshot$: Observable<any>;
  mapUrl: string = null;
  mapFile: any = null;
  newMapGridWidth: number = null;
  newMapGridHeight: number = null;
  updatedMapGridWidth: number = null;
  updatedMapGridHeight: number = null;
  verticalMapIndices: string[] = null;
  horizontalMapIndices: string[] = null;
  gridCellWidth: number;
  gridCellHeight: number;
  mapGridColor = '#aaaaaa';

  loadingNewMap = false;

  participantsOnMap: ParticipantCoordinate[] = [];
  snapToGrid = false;
  showGrid = true;

  @ViewChild('mapImageElement') mapImageElement: ElementRef;

  constructor(private storage: AngularFireStorage,
              private encounterParticipantQuery: EncounterParticipantQuery,
              private mapService: MapService,
              private mapQuery: MapQuery,
              private encouterService: EncounterService,
              private encounterQuery: EncounterQuery,
              private messageService: MessageService) { }

  ngOnInit() {
    this.encounter = this.encounterQuery.getEntity(this.encounterId);
    this.encounterQuery.selectEntity(this.encounterId).subscribe(encounter => {
      this.encounter = encounter;
    });

    this.encounterParticipants$ = this.encounterParticipantQuery.selectAll({
      filterBy: encounterParticipant => this.encounter.participantIds.includes(encounterParticipant.id),
      sortBy: 'name'
    });

    if (this.encounter.mapId) {
      this.map = this.mapQuery.getEntity(this.encounter.mapId);
      this.updatedMapGridHeight = this.map.gridHeight;
      this.updatedMapGridWidth = this.map.gridWidth;
      this.generateMapIndices();
    }
  }

  ngAfterViewChecked(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    setTimeout(() => {
      this.calcGridCellSize();
    }, 10);
  }

  loadNewMap() {
    this.loadingNewMap = true;

    this.startUpload(this.mapFile, imageUrl => {
      this.mapUrl = imageUrl;
      const newMap = {
        id: guid(),
        mapUrl: this.mapUrl,
        gridWidth: this.newMapGridWidth,
        gridHeight: this.newMapGridHeight,
        participantCoordinates: []
      };
      this.mapService.add(newMap)
      .then(() => {
        return this.encouterService.update({...this.encounter, mapId: newMap.id});
      })
      .then(() => {
        if (this.map) {
          this.storage.storage.refFromURL(this.map.mapUrl).delete();
          this.mapService.remove(this.map.id);
        }

        this.map = newMap;

        this.updatedMapGridHeight = newMap.gridHeight;
        this.updatedMapGridWidth = newMap.gridWidth;
        this.generateMapIndices();

        this.newMapGridHeight = null;
        this.newMapGridWidth = null;
      });

      this.participantsOnMap = [];
      this.loadingNewMap = false;
    });
  }


  fileChanged(event) {
    this.mapFile = event.target.files[0];
  }

  startUpload(file, callback) {
    if (file === null) {
      return;
    }

    const path = `images/${new Date().getTime()}_${file.name}`;

    this.task = this.storage.upload(path, file);
    const ref = this.storage.ref(path);

    this.percentage$ = this.task.percentageChanges();
    this.snapshot$   = this.task.snapshotChanges();

    this.task.snapshotChanges().pipe(
      finalize(() => {
        ref.getDownloadURL().subscribe(url => {
          callback(url);
        });
      })
    )
    .subscribe();
  }

  iconText(participantName: string): string {
    return participantName.substr(0, 1).toUpperCase();
  }

  updateGridSize() {
    this.mapService.update({...this.map, gridWidth: this.updatedMapGridWidth, gridHeight: this.updatedMapGridHeight});
    this.generateMapIndices();
    this.messageService.addInfo('Updated map size');
  }

  revertGridSizeFieldValues() {
    this.updatedMapGridWidth = this.map.gridWidth;
    this.updatedMapGridHeight = this.map.gridHeight;
  }

  generateMapIndices() {
    if (this.updatedMapGridHeight && this.updatedMapGridWidth) {
      this.horizontalMapIndices = [];
      const stringIdGenerator = new StringIdGenerator();
      for (let i = 0; i < this.updatedMapGridWidth; i++) {
        this.horizontalMapIndices.push(stringIdGenerator.next());
        // this.horizontalMapIndices.push(i.toString());
      }

      this.verticalMapIndices = [];
      for (let j = 0; j < this.updatedMapGridHeight; j++) {
        this.verticalMapIndices.push(j.toString());
      }

      setTimeout(() => {
        this.calcGridCellSize();
      }, 100);
    }

  }

  calcGridCellSize() {
    if (this.updatedMapGridHeight && this.updatedMapGridWidth) {
      const imageElement = (this.mapImageElement.nativeElement as HTMLElement);
      // console.log('calculating cell size', imageElement.getBoundingClientRect(), imageElement.offsetHeight, imageElement.offsetWidth);
      this.gridCellWidth = imageElement.getBoundingClientRect().width / this.updatedMapGridWidth;
      this.gridCellHeight = imageElement.getBoundingClientRect().height / this.updatedMapGridHeight;
      // console.log(`w: ${this.gridCellWidth}, h: ${this.gridCellHeight}`);
    }
  }
}
