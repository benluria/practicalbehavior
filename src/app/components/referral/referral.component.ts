import { Component, OnInit, SecurityContext } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReferralService } from 'src/app/services/referral.service';
import { parsePhoneNumberFromString, parsePhoneNumber, CountryCode } from 'libphonenumber-js/min';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {
  appContent: AppContentTable = {};
  referral: FormGroup;
  didd = false;
  personFillingOutForm = false;
  diagnosisCount: number;
  behaviorsDescriptionCount: number;
  showErrorModal = false;
  attemptedSubmit = false;
  
  behaviorCheckboxes: {
    name: string, 
    label: string, 
    checked: boolean
  }[] = [];
  
  treatmentCheckboxes: {
    name: string, 
    label: string, 
    checked: boolean
  }[] = [];
    
  constructor(private contentService: AppContentService,
              private fb: FormBuilder,
              private referralService: ReferralService) { }

  async ngOnInit() {
    this.appContent = await this.contentService.getContentForPage(PAGES.referral);
    await this.getFormInfo();
    this.createForm();
  }

  async getFormInfo() {
    const resp = await this.referralService.getInfo();
    this.behaviorCheckboxes = [ 
      {
        name: 'physicalAggression',
        label: 'Physical Aggression (Harming, or attempting to harm, another individual)',
        checked: false
      },
      {
        name: 'selfInjurious',
        label: 'Self-Injurious Behaviors (Harming, or attempting to harm, self)',
        checked: false
      },
      {
        name: 'propertyDestruction',
        label: 'Property Destruction (Destroying, or attempting to destroy, property)',
        checked: false
      },
      {
        name: 'elopement',
        label: 'Elopement (Leaving, or attempting to leave, the supervised area)',
        checked: false
      },
      {
        name: 'PICA',
        label: 'PICA (Ingesting, or attempting to ingest, inedible objects)',
        checked: false
      },
      {
        name: 'tantrum',
        label: 'Tantrum (Crying, screaming, yelling, throwing things, or falling to the floor)',
        checked: false
      },
      {
        name: 'verbalAggression',
        label: 'Verbal Aggression (Yelling, screaming, or cursing at another individual)',
        checked: false
      },
      {
        name: 'noncompliance',
        label: 'Noncompliance (Not complying with necessary instructions)',
        checked: false
      },
      {
        name: 'otherCheckbox',
        label: 'Other',
        checked: false
      }
    ];
    this.treatmentCheckboxes = [
      {
        name: 'speechTherapy',
        label: 'Speech Therapy',
        checked: false
      },
      {
        name: 'occupationalTherapy',
        label: 'Occupational Therapy',
        checked: false
      },
      {
        name: 'aba',
        label: 'ABA',
        checked: false
      },
      {
        name: 'informalTreatment',
        label: 'Informal Behavior Treatment',
        checked: false
      },
      {
        name: 'medication',
        label: 'Medication',
        checked: false
      },
      {
        name: 'otherTreatmentCheckbox',
        label: 'Other',
        checked: false
      }
    ]
  }

  createForm() {
    this.attemptedSubmit = false;

    this.referral = this.fb.group({
      //#region PATIENT INFO
      patient: this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
        dob: ['', [Validators.required]],
        phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(25)]],
        address: ['', [Validators.required, Validators.maxLength(35)]],
        address2: ['', [Validators.maxLength(35)]],
        city: ['', [Validators.required, Validators.maxLength(25)]],
        state: ['', Validators.required],
        zip: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
        email: ['', [Validators.required, Validators.maxLength(40)]],
        diagnosis: ['', [Validators.required, Validators.maxLength(175)]],
      }),
      //#endregion

      //#region INSURANCE
      insurance: this.fb.group({
        number: [''],
        name: ['', Validators.required],
        nameOther : ['', Validators.maxLength(90)],
      }),
      //#endregion

      //#region PERSON FILLING OUT FORM
      otherPerson: this.fb.group({
        notApplicable: false,
        name: [''],
        phone: [''],
        fax: [''],
        email: [''],
      }),
      //#endregion
      
      //#region PREVIOUS TREATMENT
      previousTreatmentBoxes: this.fb.group({
        speechTherapy: false,
        occupationalTherapy: false,
        aba: false,
        informalTreatment: false,
        medication: false,
        otherTreatmentCheckbox: false,
        otherTreatment: '',
      }),
      //#endregion
      
      //#region GUARDIAN
      guardian: this.fb.group({
        notApplicable: false,
        name: [''],
        phone: [''],
        email: [''],
        address: [''],
        address2: [''],
        city: [''],
        state: [''],
        zip: [''],
        preferredEmail: false,
        preferredPhone: false,
        preferredAM: false,
        preferredPM: false,
      }),
      //#endregion
      
      //#region BEHAVIOR BOXES
      behaviorBoxes: this.fb.group({
        physicalAggression: false,
        selfInjurious: false,
        propertyDestruction: false,
        elopement: false,
        PICA: false,
        tantrum: false,
        verbalAggression: false,
        noncompliance: false,
        otherCheckbox: false,
        other: [''],
      }),
      //#endregion

      behaviorsDescription: ['', [Validators.required, Validators.maxLength(175)]]
    }
    // , {validator: this.checkDate('patientDOB')}
    );

    this.referral.get('patient.phone').valueChanges.subscribe(val => this.formatPhone(val, 'patient'));
    this.referral.get(`guardian.phone`).valueChanges.subscribe(val => this.formatPhone(val, 'guardian'));
    this.referral.get(`otherPerson.phone`).valueChanges.subscribe(val => this.formatPhone(val, 'otherPerson'));
    
    this.referral.get('patient.diagnosis').valueChanges.subscribe(val => this.diagnosisCount = val.length || 0);
    this.referral.get('behaviorsDescription').valueChanges.subscribe(val => this.behaviorsDescriptionCount = val.length || 0);

    this.referral.get('guardian.notApplicable').valueChanges.subscribe(val => this.setValidatiors(val, 'guardian'));
    this.setValidatiors(false, 'guardian'); // default, checkbox is unchecked

    this.referral.get('otherPerson.notApplicable').valueChanges.subscribe(val => this.setValidatiors(val, 'otherPerson'));
    this.setValidatiors(false, 'otherPerson'); // default, checkbox is unchecked
  }

  setValidatiors(isChecked: boolean, prefix: string) {
    var groups = this.referral['controls'];
    const group: FormGroup = groups[prefix] as FormGroup;
    if (!isChecked) {
      for(const key in group.controls) {
        const control = this.referral.get(`${prefix}.${key}`);
        control.setValidators([Validators.required, Validators.maxLength(50)]);
      }
    } else {
      group.clearValidators();

      const controlsToReset = Object.keys(group.controls);
      controlsToReset.shift();
      controlsToReset.forEach(key => {
        const control = group.get(key);
        control.clearValidators();
        control.reset();
      });
    }
  }

  formatPhone(val: string, prefix: string) {
    if (val) {
      const phoneNumber = parsePhoneNumberFromString(val, 'US');
      if (phoneNumber && phoneNumber.isValid()) {
        const formatted = phoneNumber.formatNational(); 
        if (!val.includes(formatted))
          this.referral.get(`${prefix}.phone`).patchValue(formatted);
      }
    }
  }

  checkDate(date: string) {
    let resp = {};

    return (group: FormGroup): {[key:string]: any} => {
      let control = group.controls[date];
      if (new Date(control.value) < new Date()) {
        resp = {
          dob: 'Please enter a valid date'
        }
      }
      return resp;
    }
  }

  onSubmit() {
    this.attemptedSubmit = true;
    // if (this.referralService.referralCount > 0) {
    //   alert('are you sure?');
    //   //show 'are you sure';
    //   return;
    // } else if (this.referralService.referralCount > 4) {
    //   alert('nah man...');
    //   //please try again later (denied)
    //   return;
    // }

    let hasSelectedTreatment = false;
    const treatmentBoxValues = this.referral.value.previousTreatmentBoxes;
    for(let box in treatmentBoxValues) {
      if (treatmentBoxValues[box]) {
        hasSelectedTreatment = true;
        break;
      }
    }

    let hasSelectedBehavior = false;
    const behaviorBoxValues = this.referral.value.behaviorBoxes;
    for(let box in behaviorBoxValues) {
      if (behaviorBoxValues[box]) {
        hasSelectedBehavior = true;
        break;
      }
    }      

    if (!this.referral.valid || !hasSelectedTreatment || !hasSelectedBehavior) {
      this.showErrorModal = true;
      return;
    }

    const formValues = this.referral.value;
    console.log(formValues);
    this.referralService.sendReferral(formValues);
  }

  behaviorCheckboxChange(box: any, prefix: string) {
    box.checked = !box.checked;
    this.referral.get(`${prefix}.${box.name}`).patchValue(box.checked);
  }

  handleCheckboxChange(control: FormControl) {
    control.patchValue(!control.value);
  }

  getCheckedValue(control: FormControl) {
    return control.value;
  }

  handleDIDD() {
    this.didd = !this.didd; 
    if (this.didd) {
      this.referral.get('insurance.name').disable()
      this.referral.get('insurance.number').disable()
    } else {
      this.referral.get('insurance.name').enable();
      this.referral.get('insurance.number').enable();
    }
  }

}
