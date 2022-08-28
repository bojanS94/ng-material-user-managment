import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-add-dialog',
  templateUrl: './user-add-dialog.component.html',
  styleUrls: ['./user-add-dialog.component.css']
})
export class UserAddDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    public dialogBox: MatDialogRef<UserAddDialogComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      username: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });
  }

  save() {
    this.http.post<any>("http://localhost:3000/users", this.form.value).subscribe(resolve => {
      alert("User added successfully!")
      this.form.reset();
      this.dialogBox.close();
    }, error => {
      alert("Unable to add user!")
    })
  }

  close() {
    this.dialogBox.close();
  }
}
