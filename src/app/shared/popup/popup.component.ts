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
  @ContentChild('popupToggleTemplate', { read: TemplateRef }) popupToggleTemplate: TemplateRef<any>;

  hidden = true;

  popupLeftShift = null;

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
        this.popupLeftShift = this.getLeftShift();
      }
    }, 0);
  }

  getLeftShift() {
    const windowWidth = document.documentElement.clientWidth;
    const popupElementRect = (this.popup.nativeElement as HTMLElement).getBoundingClientRect();
    const popupRightSide = popupElementRect.right;
    const currentLeft = parseFloat(getComputedStyle(this.popup.nativeElement).left);

    let leftShift = currentLeft;
    if (popupRightSide > windowWidth) {
      leftShift = currentLeft - (popupRightSide - windowWidth);
    }

    return leftShift + 'px';
  }

}
