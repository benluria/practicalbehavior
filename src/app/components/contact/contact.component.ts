import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta
    ) { }

  ngOnInit() {
    //get app content
    //replace content below with appcontent
    this.title.setTitle('Contact');
    this.meta.updateTag({name: 'description', content: 'Office Phone: 615-669-6397 | Email: office@practicalbehavior.com'}, `name='description'`)
  }

}
