import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ImageTools } from './image-tools';

export const AVATAR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvatarUploaderComponent),
  multi: true,
};

@Component({
  selector: 'app-avatar-uploader',
  templateUrl: './avatar-uploader.component.html',
  styleUrls: ['./avatar-uploader.component.scss'],
  providers: [AVATAR_VALUE_ACCESSOR]
})
export class AvatarUploaderComponent implements OnInit, ControlValueAccessor {
  @Input() maxSize = 100; //px

  avatarUrl: string;
  task: AngularFireUploadTask;
  percentage$: Observable<number>;
  snapshot$: Observable<any>;

  onChange: any = () => {};

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
  }

  startUpload(event: FileList) {
    const file = event.item(0);

    if (file === null) {
      return;
    }

    ImageTools.resize(event.item(0), {
      width: this.maxSize, // maximum width
      height: this.maxSize // maximum height
    }, (blob, didItResize) => {
        // didItResize will be true if it managed to resize it, otherwise false (and will return the original file as 'blob')
        // this.avatarUrl = window.URL.createObjectURL(blob);
        // you can also now upload this blob using an XHR.

        const path = `images/${new Date().getTime()}_${file.name}`;

        this.task = this.storage.upload(path, blob);
        const ref = this.storage.ref(path);

        this.percentage$ = this.task.percentageChanges();
        this.snapshot$   = this.task.snapshotChanges();

        this.task.snapshotChanges().pipe(
          finalize(() => {
            ref.getDownloadURL().subscribe(url => {
              this.avatarUrl = url;
              this.onChange(this.avatarUrl);
            });
          })
        )
        .subscribe();

    });
  }

  writeValue(obj: any): void {
    this.avatarUrl = obj;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

}
