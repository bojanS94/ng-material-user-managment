import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/interfaces/users';
import { CrudService } from 'src/app/services/crud.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'src/app/services/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessagePopupComponent } from '../message-popup/message-popup.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  users?: Users[];
  usersArray: Users[] = [];
  durationInSeconds = 5;

  constructor(
    private crudService: CrudService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private dialogService: DialogService,
    private _snackBar: MatSnackBar
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.crudService.getAllUsers().subscribe(res => {
      this.dataSource.data = res;
    }, error => {
      alert(error);
    }
    )
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  deleteUser(user: Users) {
    this.dialogService.openConfirmDialog('Are you sure you want to delete this user?').afterClosed().subscribe(res => {
      if (res) {
        this.crudService.deleteUser(user);
      }
      this.openSnackBar();
    })
  }

  openSnackBar() {
    this._snackBar.openFromComponent(MessagePopupComponent, {
      duration: this.durationInSeconds * 1000,
    });
  }

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'username', 'password', 'email', 'status', 'edit', 'delete'];
  dataSource = new MatTableDataSource<Users>(this.usersArray);
}
