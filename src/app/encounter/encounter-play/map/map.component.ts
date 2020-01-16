import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { EntityActions, guid } from '@datorama/akita';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { MessageService } from 'src/app/messages/state/message.service';

import { EncounterParticipant } from '../../encounter-participant/state/encounter-participant.model';
import { EncounterParticipantQuery } from '../../encounter-participant/state/encounter-participant.query';
import { EncounterParticipantService } from '../../encounter-participant/state/encounter-participant.service';
import { Encounter } from '../../state/encounter.model';
import { EncounterQuery } from '../../state/encounter.query';
import { EncounterService } from '../../state/encounter.service';
import { Map } from './state/map.model';
import { MapQuery } from './state/map.query';
import { MapService } from './state/map.service';
import { StringIdGenerator } from './string-id-generator';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewChecked {
  exitIcon = faSignOutAlt;

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
  fileSizeError = false;

  participantsOnMap = [];
  snapToGrid = true;
  showGrid = true;

  isDraggingParticipantFromList = false;
  draggedParticipantFromList = null;

  mapParticipantScale = 1;

  @ViewChild('mapImageElement') mapImageElement: ElementRef;

  constructor(private storage: AngularFireStorage,
              private encounterParticipantQuery: EncounterParticipantQuery,
              private encounterParticipantService: EncounterParticipantService,
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


      if (this.map.participantCoordinates && this.map.participantCoordinates.length > 0) {
        for (const mapParticipant of this.map.participantCoordinates) {
          const participant$ = this.encounterParticipantQuery.selectEntity(mapParticipant.participantId);
          this.participantsOnMap.push({
            participantId: mapParticipant.participantId,
            participant$,
            initialInfoPos: (mapParticipant.infoX != null && mapParticipant.infoY != null) ? {
              x: mapParticipant.infoX,
              y: mapParticipant.infoY
            } : null,
            initialCoord: {
              x: mapParticipant.x,
              y: mapParticipant.y
            },
            currentCoord: {
              x: mapParticipant.x,
              y: mapParticipant.y
            }
          });
        }
      }
    }

    this.encounterParticipantQuery.selectEntityAction(EntityActions.Remove).subscribe(removedIds => {
      this.participantsOnMap = this.participantsOnMap.filter(item => !removedIds.includes(item.participantId));
      this.saveMapParticipants();
    });
  }

  ngAfterViewChecked(): void {
    if (this.map && !this.gridCellWidth && !this.gridCellHeight) {
      setTimeout(() => {
        this.calcGridCellSize();
      }, 0);
    }
  }

  loadNewMap(hideFn) {
    if (this.fileSizeError) {
      return;
    }

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

    hideFn();
  }

  fileChanged(event) {
    this.mapFile = event.target.files[0];
    const fileSize = this.mapFile.size / (1024 * 1024);
    this.fileSizeError = fileSize > 5;
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
    this.map = {...this.map, gridWidth: this.updatedMapGridWidth, gridHeight: this.updatedMapGridHeight};
    this.mapService.update(this.map);
    console.log('saved map', this.map);
    this.generateMapIndices();
    this.messageService.addInfo('Updated map size');
  }

  revertGridSizeFieldValues() {
    this.updatedMapGridWidth = this.map.gridWidth;
    this.updatedMapGridHeight = this.map.gridHeight;
  }

  generateMapIndices() {
    if (this.map.gridHeight && this.map.gridWidth) {
      this.horizontalMapIndices = [];
      const stringIdGenerator = new StringIdGenerator();
      for (let i = 0; i < this.map.gridWidth; i++) {
        this.horizontalMapIndices.push(stringIdGenerator.next());
      }

      this.verticalMapIndices = [];
      for (let j = 0; j < this.map.gridHeight; j++) {
        this.verticalMapIndices.push((j + 1).toString());
      }

      setTimeout(() => {
        this.calcGridCellSize();
      }, 0);
    }
  }

  calcGridCellSize() {
    if (this.map.gridWidth && this.map.gridHeight) {
      const imageElement = (this.mapImageElement.nativeElement as HTMLElement);
      this.gridCellWidth = imageElement.getBoundingClientRect().width / this.map.gridWidth;
      this.gridCellHeight = imageElement.getBoundingClientRect().height / this.map.gridHeight;

      const participantScaleX = this.gridCellWidth / 20;
      const participantScaleY = this.gridCellHeight / 20;

      this.mapParticipantScale = Math.min(participantScaleX, participantScaleY);
    }
  }

  startDraggingListedParticipant(event: DragEvent, participant: EncounterParticipant, draggedIcon) {
    event.dataTransfer.setDragImage(draggedIcon, 0, 0);
    this.isDraggingParticipantFromList = true;
    this.draggedParticipantFromList = participant;
  }

  stopDraggingListedParticipant(event: DragEvent) {
    this.isDraggingParticipantFromList = false;
  }

  dragParticipantOverMap(event: DragEvent) {
    event.preventDefault();
  }

  dropParticipantOnMap(event: DragEvent) {
    event.preventDefault();
    const imgCoords = this.mapImageElement.nativeElement.getBoundingClientRect();
    if (this.isDraggingParticipantFromList) {
      let participantCoordX;
      let participantCoordY;

      if (this.snapToGrid && this.map.gridWidth && this.map.gridHeight) {
        const cellX = Math.floor((event.clientX - imgCoords.left) / this.gridCellWidth);
        const cellY = Math.floor((event.clientY - imgCoords.top) / this.gridCellHeight);
        participantCoordX = cellX * this.gridCellWidth;
        participantCoordY = cellY * this.gridCellHeight;
      } else {
        participantCoordX = event.clientX - imgCoords.left;
        participantCoordY = event.clientY - imgCoords.top;
      }

      const participantCoordinate = {
        participantId: this.draggedParticipantFromList.id,
        x: participantCoordX,
        y: participantCoordY
      };

      this.participantsOnMap.push({
        participantId: this.draggedParticipantFromList.id,
        participant$: this.encounterParticipantQuery.selectEntity(this.draggedParticipantFromList.id),
        initialInfoPos: null,
        initialCoord: participantCoordinate,
        currentCoord: participantCoordinate});

      this.draggedParticipantFromList = null;
      this.saveMapParticipants();
    }
  }

  isParticipantOnMap(participantId: string) {
    const result = this.participantsOnMap.findIndex(item => item.participantId === participantId) >= 0;
    return result;
  }

  removeParticipantFromMap(participantId) {
    this.participantsOnMap = this.participantsOnMap.filter(item => item.participantId !== participantId);
    this.saveMapParticipants();
  }

  dragMapParticipantEnded(event: CdkDragEnd, mapParticipantIndex: number) {
    const participantPos = event.source.element.nativeElement.getBoundingClientRect();
    const imgCoords = this.mapImageElement.nativeElement.getBoundingClientRect();

    let newCoordX = participantPos.left - imgCoords.left;
    let newCoordY = participantPos.top - imgCoords.top;

    if (this.snapToGrid && this.map.gridWidth && this.map.gridHeight) {
      const cellX = Math.floor((participantPos.left - imgCoords.left) / this.gridCellWidth);
      const cellY = Math.floor((participantPos.top - imgCoords.top) / this.gridCellHeight);
      const snappedCoordX = cellX * this.gridCellWidth;
      const snappedCoordY = cellY * this.gridCellHeight;

      const coordShiftX = snappedCoordX - newCoordX;
      const coordShiftY = snappedCoordY - newCoordY;

      const initialCoord = this.participantsOnMap[mapParticipantIndex].initialCoord;

      this.participantsOnMap[mapParticipantIndex].initialCoord = {
        x: initialCoord.x + coordShiftX,
        y: initialCoord.y + coordShiftY
      };

      newCoordX = snappedCoordX;
      newCoordY = snappedCoordY;
    }

    this.participantsOnMap[mapParticipantIndex].currentCoord = {
      x: newCoordX,
      y: newCoordY
    };
    this.saveMapParticipants();
  }

  saveMapParticipants() {
    const participantCoordinates = [];
    for (const mapParticipant of this.participantsOnMap) {
      const coord = {
        participantId: mapParticipant.participantId,
        x: mapParticipant.currentCoord.x,
        y: mapParticipant.currentCoord.y,
        infoX: mapParticipant.initialInfoPos ? mapParticipant.initialInfoPos.x : null,
        infoY: mapParticipant.initialInfoPos ? mapParticipant.initialInfoPos.y : null,
        gridX: null,
        gridY: null
      };
      participantCoordinates.push(coord);
    }
    this.map = {...this.map, participantCoordinates};
    this.mapService.update(this.map);
  }


  deleteMap() {
    if (this.map) {
      this.storage.storage.refFromURL(this.map.mapUrl).delete();
      this.mapService.remove(this.map.id);
      this.map = null;
      this.participantsOnMap = [];
    }
  }

  updateParticipantSizes(width: number, height: number, participant: EncounterParticipant) {
    this.encounterParticipantService.update({...participant, mapSizeX: width, mapSizeY: height});
  }

  revertParticipantSizes(widthInput, heightInput, participant: EncounterParticipant) {
    widthInput.value = participant.mapSizeX || 1;
    heightInput.value = participant.mapSizeY || 1;
  }

  onMapParticipantInfoMoved(infoPos, i) {
    this.participantsOnMap[i].initialInfoPos = infoPos;
    this.saveMapParticipants();
  }
}
