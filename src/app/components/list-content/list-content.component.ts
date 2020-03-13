import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppContent } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';

import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PAGES } from 'src/app/models/pages.const';
import { Employee } from 'src/app/models/employee.model';
import { Service } from 'src/app/models/service.model';

@Component({
  selector: 'app-list-content',
  templateUrl: './list-content.component.html',
  styleUrls: ['./list-content.component.scss']
})
export class ListContentComponent implements OnInit {
  page: string;
  appContent: AppContent[];
  tiles: AppContent[];
  activeItem: AppContent;
  appContentForm: FormGroup;

  employeesOpen: boolean;
  employees: Employee[];

  servicesOpen: boolean;
  services: Service[];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '8rem',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Montserrat',
    defaultFontSize: '',
    fonts: [
      {class: 'montserrat', name: 'Montserrat'}
    ],
    customClasses: [
    // {
    //   name: 'quote',
    //   class: 'quote',
    // },
    // {
    //   name: 'redText',
    //   class: 'redText'
    // },
    // {
    //   name: 'titleText',
    //   class: 'titleText',
    //   tag: 'h1',
    // },
  ],
  uploadUrl: 'v1/image',
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['insertVideo'],
    ['insertImage'],
    ['fontSize'],
    ['customClasses', 'textColor', 'backgroundColor']
  ]
};     

  constructor(private contentService: AppContentService,
              private route: ActivatedRoute,
              private fb: FormBuilder) { }

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.page = params.page;
    });

    switch (this.page) {
      case 'ABOUT US':
        const employeesRaw = await Promise.all([
          this.contentService.getEmployees(),
          this.retrieveAppContent()
        ]);
  
        this.employees = employeesRaw[0];
        break;
      case 'SERVICES PROVIDED':
        const servicesRaw = await Promise.all([
          this.contentService.getServices(),
          this.retrieveAppContent()
        ]);

        this.services = servicesRaw[0];
        break;
      default:
        await this.retrieveAppContent();
    }

    this.setUpForm();
  }

  setUpForm() {
    let controls = {};
    this.appContent.forEach(x => {
      controls[x.description] = new FormControl(x.content);
    });

    if (this.employees) {
      controls['employee'] = this.fb.group({
        id: 0,
        name: ['', Validators.required],
        description: '',
        description2: '',
        education: '',
        location: ''
      });
    }

    this.appContentForm = this.fb.group(controls);
  }

  async retrieveAppContent(refreshCache = false) {
    const content = await this.contentService.retrieveContent(refreshCache);
    this.appContent = content.filter(x => x.page == this.page && x.description.indexOf('TILE:') < 0);
    
    if (this.page == PAGES.home) {
      const tilesRaw = content.filter(x => x.page == this.page && x.description.indexOf('TILE:') >= 0);
      
      tilesRaw.forEach(x => {
        const tile = new AppContent(x);
        tile.description = tile.description.replace('TILE:', '');
        this.appContent.push(tile);
      });
    }
  }

  cancelChanges(item: AppContent) {
    console.log('cancel', item);
    this.setUpForm();
  }

  async saveChanges(item: AppContent) {
    console.log('save', item);
    const control = this.appContentForm.get(item.description);
    if (control.value) {
      const success = await this.contentService.updateContent(item.id, control.value);
      if (success) {
        await this.retrieveAppContent(true);
        this.setUpForm();
        //show confirmation
      } else {
        //show error
      }
    }
  }

  async saveEmployee() {
    const formValues = this.appContentForm.value.employee;

    if (!formValues.name) return;

    await this.contentService.saveEmployee(formValues);

    const form = this.appContentForm.get('employee') as FormGroup;
    form.reset();

    await this.contentService.retrieveContent(true);

    this.employees = await this.contentService.getEmployees();
  }

  async deleteEmployee() {
    let id = this.appContentForm.value.employee.id;
    if (id > 0) {
      await this.contentService.deleteEmployee(id);
      const form = this.appContentForm.get('employee') as FormGroup;
      form.reset();
      await this.contentService.retrieveContent(true);
      this.employees = await this.contentService.getEmployees();  
    }
  }

  fillEmployeeForm(employee: Employee = null) {
    let employeeForm = this.appContentForm.get('employee') as FormGroup;
    if (employee) {
      employeeForm.setValue(employee);
      // employeeForm = this.fb.group({
      //   id: employee.id,
      //   name: employee.name,
      //   description: employee.description,
      //   description2: employee.description2,
      //   education: employee.education,
      //   location: employee.location
      // });
    } else {
      employeeForm.reset();
    }
  }

}
