import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-restau',
  templateUrl: './header-restau.component.html',
  styleUrls: ['./header-restau.component.css']
})
export class HeaderRestauComponent implements OnInit {

  showDropdown: boolean = false;

  constructor(private router: Router) { }
  // header:Headers|undefined

  ngOnInit(): void {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  handleOption1() {
    this.router.navigate(['/ajoutType']);
    this.showDropdown = false;
  }

  handleOption2() {
    this.router.navigate(['/ajoutPlat']);
    this.showDropdown = false;
  }

  handleOption3() {
    this.router.navigate(['/ajoutMenu']);
    this.showDropdown = false;
  }

  handleOption4() {
    this.router.navigate(['/ajoutInfo']);
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const dropdownElement = document.getElementById('votreDropdownId');

    if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
      this.showDropdown = false;
    }
  }
}
