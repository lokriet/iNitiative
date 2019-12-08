import { Component, OnInit, Input, ElementRef, ViewChild, ContentChild, TemplateRef, ViewEncapsulation, Directive } from '@angular/core';

// @Directive({ selector: '[appInsidesTmp]' })
// export class PopupInsidesTemplateDirective {
//     constructor(public template: TemplateRef<any>) { }
// }

// @Directive({ selector: '[appToggleTmp]' })
// export class PopupToggleTemplateDirective {
//     constructor(public template: TemplateRef<any>) { }
// }


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
  @ContentChild('popupInsidesTemplate', { read: TemplateRef }) popupInsidesTemplate: TemplateRef<any>;
  @ContentChild('popupToggleTemplate', { read: TemplateRef }) popupToggleTemplate: TemplateRef<any>;

  hidden = true;

  popupRightShift = '0';

  constructor() { }

  ngOnInit() {
    if (this.floating) {
      this.popupRightShift = '40%';
    }
  }

  hidePopup = () => {
    this.hidden = true;
  }

  switchShowingPopup = () => {
    this.hidden = !this.hidden;

    if (!this.hidden && !this.floating) {
      this.popupRightShift = this.getRightShift() + 'px';
    }
  }

  getRightShift(): number {
    const windowWidth = document.documentElement.clientWidth;
    const popupParentElement = (this.popupParent.nativeElement as HTMLElement);
    const popupRightSide = popupParentElement.getBoundingClientRect().right + 250;
    let rightShift = 0;
    if (popupRightSide > windowWidth) {
      rightShift = popupRightSide - windowWidth;
    }

    return rightShift;
  }

}
