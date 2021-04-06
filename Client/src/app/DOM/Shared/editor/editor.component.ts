import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  @Input() content: string;
  @Output() contentChange = new EventEmitter<string>();

  editordoc: string;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    // ['underline', 'strike'],
    // ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    // [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', Validators.required()),
  });
  constructor() {}

  get doc(): AbstractControl {
    return this.form.get('editorContent');
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editordoc = this.content;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onChange() {
    this.contentChange.emit(this.editordoc);
  }
}
