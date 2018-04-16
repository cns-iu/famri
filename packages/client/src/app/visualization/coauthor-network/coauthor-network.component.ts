import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'famri-coauthor-network',
  templateUrl: './coauthor-network.component.html',
  styleUrls: ['./coauthor-network.component.sass']
})
export class CoauthorNetworkComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;

  constructor() { }

  ngOnInit() {
  }

}
