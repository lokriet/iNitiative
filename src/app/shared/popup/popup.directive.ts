import { Directive, ElementRef, Input, OnInit, Output, EventEmitter, NgZone, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appPopup]'
})
export class PopupWindowDirective implements OnInit {
  @Input('appPopup') resizable = false;
  // tslint:disable-next-line: no-input-rename
  @Input('movable') movable = true;
  // tslint:disable-next-line: no-input-rename
  @Input('closable') closable = true;
  @Output() closed = new EventEmitter();

  htmlElement: HTMLElement;

  isMoving = false;
  dragOffset: any;

  isResizing = false;
  initialResizePoint: any;
  initialSize: any;

  listenersInitialized = false;

  boundMousemoveMove;
  boundMousemoveResize;

  private unlistenMousemoveMove: Function;
  private unlistenMousemoveResize: Function;

  constructor(el: ElementRef, private ngZone: NgZone, private renderer: Renderer2) {
    this.htmlElement = (el.nativeElement as HTMLElement);
  }

  ngOnInit(): void {

    if (this.movable) {
      const header = document.createElement('div');
      header.classList.add('draggable-header');

      this.htmlElement.appendChild(header);

      header.addEventListener('mousedown', this.mousedownMove.bind(this));
      header.addEventListener('mouseup', this.mouseupMove.bind(this));
      this.boundMousemoveMove =  this.mousemoveMove.bind(this);
    }

    if (this.closable) {
      const closeButton = document.createElement('div');
      closeButton.textContent = 'x';
      closeButton.classList.add('close-button');
      closeButton.addEventListener('click', () => this.closed.emit());

      this.htmlElement.appendChild(closeButton);
    }

    if (this.resizable) {
      const resizeCorner = document.createElement('div');
      resizeCorner.classList.add('resize-corner');

      this.htmlElement.appendChild(resizeCorner);

      resizeCorner.addEventListener('mousedown', this.mousedownResize.bind(this));
      resizeCorner.addEventListener('mouseup', this.mouseupResize.bind(this));
      this.boundMousemoveResize =  this.mousemoveResize.bind(this);
    }
  }

  mousedownMove($event) {
    this.isMoving = true;
    this.dragOffset = [
        this.htmlElement.offsetLeft - $event.clientX,
        this.htmlElement.offsetTop - $event.clientY
    ];

    this.ngZone.runOutsideAngular(() => {
      this.unlistenMousemoveMove = this.renderer.listen(
        document.body,
        'mousemove',
        this.boundMousemoveMove
      );
    });


    // document.body.addEventListener('mousemove', this.boundMousemoveMove);
  }

  mouseupMove($event) {
    this.isMoving = false;
    // document.body.removeEventListener('mousemove', this.boundMousemoveMove);
    this.unlistenMousemoveMove();
  }

  mousemoveMove($event) {
    $event.preventDefault();
    if (this.isMoving) {
      const mousePosition = {
          x : $event.clientX,
          y : $event.clientY
      };

      this.htmlElement.style.left = (mousePosition.x + this.dragOffset[0]) + 'px';
      this.htmlElement.style.top  = (mousePosition.y + this.dragOffset[1]) + 'px';
    }
  }


  mousedownResize($event) {
    this.isResizing = true;
    this.initialResizePoint = { x: $event.clientX, y: $event.clientY };
    this.initialSize = { x: parseFloat(getComputedStyle(this.htmlElement).width),
                         y: parseFloat(getComputedStyle(this.htmlElement).height) };

    // document.body.addEventListener('mousemove', this.boundMousemoveResize);
    this.ngZone.runOutsideAngular(() => {
      this.unlistenMousemoveResize = this.renderer.listen(
        document.body,
        'mousemove',
        this.boundMousemoveResize
      );
    });

    $event.stopPropagation();
  }

  mouseupResize($event) {
    this.isResizing = false;
    // document.body.removeEventListener('mousemove', this.boundMousemoveResize);
    this.unlistenMousemoveResize();
  }

  mousemoveResize($event) {
    $event.preventDefault();

    if (this.isResizing) {
        const mouseMoveDistance = {
            x : $event.clientX - this.initialResizePoint.x ,
            y : $event.clientY - this.initialResizePoint.y
        };

        const newWindowSize = {
          x: Math.max(200, this.initialSize.x + mouseMoveDistance.x),
          y: Math.max(200, this.initialSize.y + mouseMoveDistance.y)
        };

        this.htmlElement.style.width = (newWindowSize.x) + 'px';
        this.htmlElement.style.height  = (newWindowSize.y) + 'px';
    }
  }
}
