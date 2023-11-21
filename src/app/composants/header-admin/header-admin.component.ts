import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-admin',
  templateUrl: './header-admin.component.html',
  styleUrls: ['./header-admin.component.css']
})
export class HeaderAdminComponent implements OnInit {

  showDropdown: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  handleOption1() {
    this.router.navigate(['/ajoutRestaurant']);
    this.showDropdown = false;
  }

  handleOption2() {
    this.router.navigate(['/ajoutAdmin']);
    this.showDropdown = false;
  }

  handleOption3() {
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
