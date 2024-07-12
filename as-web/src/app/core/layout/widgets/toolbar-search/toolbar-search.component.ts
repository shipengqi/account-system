import {
  AfterViewInit,
  Component,
  EventEmitter, HostBinding,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {BehaviorSubject, debounceTime, distinctUntilChanged, tap} from 'rxjs';

@Component({
  selector: 'app-toolbar-search',
  template: `
    <input class="ltr"
           [style.width.px]="inputWidth"
           [nzAutocomplete]="auto"
           (input)="searchText($event)"
           [(ngModel)]="q"
           type="text"
           nz-input
           [placeholder]="placeholder"/>
    <button nz-button nzType="text" nzSearch (click)="onClick()"><span nz-icon nzType="search"></span></button>
    <nz-autocomplete nzBackfill #auto>
      <nz-auto-option *ngFor="let i of options" [nzValue]="i">{{ i }}</nz-auto-option>
    </nz-autocomplete>
  `,
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    '[class.toolbar-nav-item]': 'true',
    '[class.ltr]': 'direction === "left"',
    '[class.rtl]': 'direction === "right"',
    '[class.expanded]': 'expanded',
  },
})
export class ToolbarSearchComponent implements AfterViewInit, OnDestroy {
  /** The direction in which the search box will expand. If the search button is aligned to the right edge of the container, specify left. */
  @Input() direction: 'left' | 'right' = 'right';

  /** Indicate whether the search field should always be expanded */
  @Input() alwaysExpanded = false;

  @Input() placeholder = 'input search text';

  private _inputWidth = 160;
  @Input()
  set inputWidth(value: number) {
    this._inputWidth = value;
  }

  get inputWidth(): number {
    return this.expanded ? this._inputWidth : 0;
  }

  /**
   * The background color of the component. Color names from the Color Palette can be used here.
   * Specify this when a transparent background would cause display issues, such as background items showing through the search field.
   */
  @Input()
  set background(value: string) {
    this._backgroundColor = value || 'transparent';
  }

  /** Emitted when the expanded state changes */
  @Output() expandedChange = new EventEmitter<boolean>();

  /**
   * Emitted when a search query has been submitted, either by pressing enter when the search field has focus, or by clicking the search button
   * when the search field contains text. The event contains the search text.
   */
  @Output() search = new EventEmitter<string>();

  /** Store the expanded state */
  private _expanded = false;
  /** Whether the input field is visible. Use this to collapse or expand the control in response to other events. */
  @Input()
  set expanded(value: boolean) {
    this._expanded = value;

    this.expandedChange.emit(this.expanded);
  }

  get expanded(): boolean {
    return this.alwaysExpanded || this._expanded;
  }

  /** Store the active background color */
  _backgroundColor = 'transparent';

  q = '';
  search$ = new BehaviorSubject('');
  loading = false;
  options: string[] = [];

  ngAfterViewInit(): void {
    this.search$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap({
        complete: () => {
          this.loading = true;
        }
      })
    ).subscribe(value => {
      this.options = value ? [value, value + value, value + value + value] : [];
      this.loading = false;
    })
  }

  ngOnDestroy(): void {
    this.search$.complete();
    this.search$.unsubscribe();
  }

  searchText(ev: Event): void {
    this.search$.next((ev.target as HTMLInputElement).value);
  }

  onClick() {
    if (!this.expanded) {
      this.expanded = true;
      return;
    }
    if (this.expanded && this.q === '') {
      this.expanded = false;
      return;
    }
    this.search.emit(this.q);
  }
}
