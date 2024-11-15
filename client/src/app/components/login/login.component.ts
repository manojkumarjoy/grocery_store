import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  regForm: FormGroup;

  constructor(private http: HttpClient, private route: Router) {
    this.regForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    })
    const jwtToken = localStorage.getItem('adminJwtToken')
    if (jwtToken){
      this.route.navigate(['/admin/home'])
    }
    const token = localStorage.getItem("jwtToken")
    if (token) {
      this.route.navigate(['/home'])
    }
  }

  onSubmit(): void {
    if (!this.regForm.valid) {
        window.alert('Please fill in all required fields.');
        return;
    }

    const details = this.regForm.value;
    this.http.post('http://localhost:5100/login', details).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.user && response.user._id) {
          localStorage.setItem('userId', response.user._id);
        }

        if (response.token) {
          // Regular user login
          window.alert('User Login Successfully!');
          localStorage.setItem('jwtToken', response.token);
          this.route.navigate(['/home']);
        } else if (response.jwtToken) {
          // Admin login
          window.alert('Admin Login Successfully!');
          localStorage.setItem('adminJwtToken', response.jwtToken);
          this.route.navigate(['/admin/dashboard']);
        } else {
          window.alert('Login failed! Invalid token response.');
        }
      },
      (error) => {
        console.error(error);
        window.alert('Login failed! Email or Password is incorrect.');
      }
    );
}



}
