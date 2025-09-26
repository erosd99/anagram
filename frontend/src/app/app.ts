import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  componentTitle = 'Anagram finder';
  result: Array<{ name: string }> = [];
  error: string | null = null;
  private http = inject(HttpClient);
  async findAnagrams(word: string) {
    // NOTE: Since we're controlling both elements of the stack,
    // We should create common typedefs that we can reuse for parsing.
    this.http
      .post<Array<{ name: string }>>('http://localhost:3000/anagram', { word: word })
      .subscribe({
        next: (data) => {
          this.result = data;
          this.error = null;
        },
        error: (err) => {
          this.error = err.error.error;
          this.result = [];
        },
      });
  }
}
