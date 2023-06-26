import { Component } from '@angular/core';

import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  imageSelected: File | null = null;
  imagePreview!: string | ArrayBuffer | null;
  outputFormat: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' = 'png';

  constructor(private dataService: DataService) {}

  onFileSelected(event: any) {
    this.imageSelected = event.target.files[0];

    if(this.imageSelected) {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/jfif', 'image/webp', 'image/gif'];
      if (!validTypes.includes(this.imageSelected.type)) {
        alert('Formato de archivo no válido. Por favor, selecciona una imagen en formato PNG, JPG, JPEG, JFIF, WEBP O GIF.');
        this.imageSelected = null;
        return;
      }

      const maxSize = 16 * 1024 * 1024;                                                             // 16 MB
      if (this.imageSelected.size > maxSize) {
        alert('File size exceeds 16 MB');
        this.imageSelected = null;
        return;
      }
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.imagePreview = event.target.result;
    }
  }

  convert() {
    if(this.imageSelected){
      const formData = new FormData();
      formData.append('image', this.imageSelected);
      formData.append('outputFormat', this.outputFormat);

      this.dataService.convertImage(formData).subscribe(
        {
          next: (response: Blob) => {
            const url= window.URL.createObjectURL(response);
            console.log(url);
            // download the file
            const a = document.createElement('a');
            a.href = url;
            a.download = `image.${this.outputFormat}`;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
          },
          error: (error) => {
            console.log(error);
          }
        }
      );
    } else {
      alert('Please select an image');
    }
  }
}
