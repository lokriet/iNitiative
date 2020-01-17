import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PopupComponent implements OnInit {
  @Input() floating = false;
  @Input() resizable = false;
  @Input() showCloseButton = false;

  @Input() windowName: string = null;

  @Input() isModalQuestion = false;
  @Input() modalQuestionText = 'Confirm?';
  @Input() yesModalOption = 'Yes';
  @Input() noModalOption = 'No';

  @ViewChild('popupParent') popupParent: ElementRef;
  @ViewChild('popupElement') popup: ElementRef;
  @ContentChild('popupInsidesTemplate', { read: TemplateRef }) popupInsidesTemplate: TemplateRef<any>;
  @ContentChild('defaultInsidesTemplate', { read: TemplateRef }) defaultInsidesTemplate: TemplateRef<any>;
  @ContentChild('popupToggleTemplate', { read: TemplateRef }) popupToggleTemplate: TemplateRef<any>;

  hidden = true;

  initialPopupShiftTransform = null;

  constructor() { }

  ngOnInit() {
  }

  hidePopup = () => {
    this.hidden = true;
  }

  switchShowingPopup = () => {
    this.hidden = !this.hidden;

    setTimeout(() => {
      if (!this.hidden && !this.isModalQuestion) {
        this.initialPopupShiftTransform = this.getInitialShift();
      }
    }, 0);
  }

  getInitialShift() {
    const windowWidth = document.documentElement.clientWidth;
    const popupElementRect = (this.popup.nativeElement as HTMLElement).getBoundingClientRect();
    const popupRightSide = popupElementRect.right;

    let leftShift = 0;
    if (popupRightSide > windowWidth) {
      leftShift = windowWidth - popupRightSide;
    }

    const windowHeight = document.documentElement.clientHeight;
    const popupBottom = popupElementRect.bottom;

    let topShift = 0;
    if (popupBottom > windowHeight) {
      topShift = windowHeight - popupBottom;
    }

    return `translate3D(${leftShift}px, ${topShift}px, 0)`;
  }

}
