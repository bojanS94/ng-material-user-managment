import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/interfaces/users';
import { CrudService } from 'src/app/services/crud.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MessagePopupComponent } from '../message-popup/message-popup.component';
import { UserAddDialogComponent } from '../user-add-dialog/user-add-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  userObject?: Users[];
  usersArray: Users[] = [];
  durationInSeconds: number = 5;

  constructor(
    private crudService: CrudService,
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

  filterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue;
  }

  addNewUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";

    dialogConfig.data = {
      id: 1,
      firstName: 'Bojan',
      lastName: 'Savic',
      username: 'savicbo',
      email: 'savic.bo@gmail.com',
      password: '123123',
      status: 'active'

    }

    this.dialog.open(UserAddDialogComponent, dialogConfig);
  }

  deleteUserDialog(user: Users) {
    //Todo popraviti da se item ne brise na NO button
    this.dialogService.openConfirmDialog('Are you sure you want to delete this user?').afterClosed().subscribe(res => {
      this.crudService.deleteUser(user).subscribe(res => {
        this.ngOnInit();
      })
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
