import { Component, OnInit, SecurityContext } from '@angular/core';
import { AppContentTable } from 'src/app/models/app-content.model';
import { AppContentService } from 'src/app/services/app-content.service';
import { PAGES } from 'src/app/models/pages.const';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ReferralService } from 'src/app/services/referral.service';

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
        name: 'physicialAggression',
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
        label: 'Speach Therapy',
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
    this.referral = this.fb.group({
      //#region PATIENT INFO
      patientName: ['', Validators.required],
      patientDOB: ['', Validators.required],
      patientAddress: [''],
      patientAddress2: [''],
      patientCity: ['', Validators.required],
      patientState: ['', Validators.required],
      patientZip: ['', Validators.required],
      patientPhone: [''],
      patientEmail: [''],
      diagnosis: ['', Validators.required],
      //#endregion

      //#region INSURANCE
      insuranceNumber: [''],
      insuranceName: ['', Validators.required],
      insuranceNameOther : [''],
      //#endregion

      //#region PERSON FILLING OUT FORM
      personFillingOut: [''],
      personFillingPhone: [''],
      personFillingFax: [''],
      personFillingEmail: [''],
      //#endregion
      
      //#region PREVIOUS TREATMENT
      speechTherapy: false,
      occupationalTherapy: false,
      aba: false,
      informalTreatment: false,
      medication: false,
      otherTreatmentCheckbox: false,
      otherTreatment: '',
      //#endregion
      
      //#region GUARDIAN
      guardianNotApplicable: false,
      guardianName: [''],
      guardianPhone: [''],
      guardianEmail: [''],
      guardianAddress: [''],
      guardianAddress2: [''],
      guardianCity: [''],
      guardianState: [''],
      guardianZip: [''],
      preferredEmail: false,
      preferredPhone: false,
      preferredAM: false,
      preferredPM: false,
      //#endregion
      
      //#region BEHAVIOR BOXES
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
      //#endregion

      behaviorsDescription: ['']
    });
  }

  onSubmit() {
    if (this.referralService.referralCount > 0) {
      alert('are you sure?');
      //show 'are you sure';
      return;
    } else if (this.referralService.referralCount > 4) {
      alert('nah man...');
      //please try again later (denied)
      return;
    }

    

    const formValues = this.referral.value;
    console.log(formValues);
    this.referralService.sendReferral(formValues);
  }

  behaviorCheckboxChange(box: any) {
    box.checked = !box.checked;
    this.referral.get(box.name).patchValue(box.checked);
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
      this.referral.get('insuranceName').disable()
      this.referral.get('insuranceNumber').disable()
    } else {
      this.referral.get('insuranceName').enable();
      this.referral.get('insuranceNumber').enable();
    }
  }

}
