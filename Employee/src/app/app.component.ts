import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['style.scss'],
})export class AppComponent implements OnInit {
  showForm = false;
  title = 'Employee';
  list: any[] = [];
  isEdit = false;
  editId: number | null = null; // Ensure it's initialized

  // Available departments
  departments: string[] = ['HR', 'Sales', 'Engineering', 'Finance', 'Others'];

  // Employee Object
  employee = {
    startDate: "",
    name: "",
    profilePic: "",
    gender: "",
    department: [] as string[], // Ensure department is an array
    salary: "",
    note: "",
  };
 
  profilePics: string[] = [
    '/assets/profilepic1.jpg',
    '/assets/profilepic2.jpg',
    '/assets/profilepic3.jpg',
    '/assets/profilepic4.jpg'
  ];
  
  constructor() {}

  ngOnInit() {
    this.fetchInfo();
  }

  // Show Employee Form
  showEmployeeForm() {
    this.showForm = true;
  }

  // Cancel Form
  cancelForm() {
    this.showForm = false;
    this.resetForm();
  }

  // Update Department Array
  updateDepartment(event: any, dept: string) {
    if (event.target.checked) {
      if (!this.employee.department.includes(dept)) {
        this.employee.department.push(dept);
      }
    } else {
      this.employee.department = this.employee.department.filter(d => d !== dept);
    }
    console.log("Updated Department List:", this.employee.department);
  }

  // Add Employee
  async submitForm() {
    console.log("Final Employee Object:", this.employee);

    try {
      const response = await fetch('http://localhost:8080/employees/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.employee),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || 'Failed to add employee');
      }

      console.log("Employee added successfully!");
      this.fetchInfo();
      this.resetForm();
      this.showForm = false;
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  }

  // Reset Form
  resetForm() {
    this.employee = {
      startDate: "",
      name: "",
      profilePic: "",
      gender: "",
      department: [],
      salary: "",
      note: "",
    };
    this.editId = null; // Reset editId after update
    this.isEdit = false; // Ensure form is in add mode
  }

  // Fetch Employees
  async fetchInfo() {
    try {
      const response = await fetch('http://localhost:8080/employees/all');
      if (!response.ok) {
        throw new Error("Connection was not ok");
      }
      this.list = await response.json();
      console.log("Data received:", this.list);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Delete Employee
  async deleteEmployee(id: number) {
    if (!confirm("Are you sure")) return;

    try {
      const response = await fetch(`http://localhost:8080/employees/delete/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }

      console.log("Employee deleted successfully!");
      this.fetchInfo();
    } catch (error) {
      console.log(error);
    }
  }

  // Edit Employee
  editEmployee(id: number) {
    this.showForm = true;
    this.isEdit = true;
    this.editId = id;

    const selectedEmployee = this.list.find(emp => emp.id === id);
    if (selectedEmployee) {
      this.employee = { ...selectedEmployee };
    }
  }

  // Update Employee
  async updateEmployee() {
    if (this.editId === null) {
      console.error("Edit ID is missing");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/employees/put/${this.editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.employee)
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to update employee");
      }

      console.log("Employee updated successfully!");
      this.fetchInfo();
      this.resetForm();
      this.showForm = false;

    } catch (error) {
      console.log("Error updating employee:", error);
    }
  }
}
