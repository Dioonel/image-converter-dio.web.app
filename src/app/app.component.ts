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
  outputFormat: 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | '' = '';
  loading = false;

  constructor(private dataService: DataService) {
  }

  onFileSelected(event: any) {
    this.imageSelected = event.target.files[0];

    if(this.imageSelected) {
      const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/jfif', 'image/webp', 'image/gif'];
      if (!validTypes.includes(this.imageSelected.type)) {
        alert('Formato de archivo no válido. Por favor, selecciona una imagen en formato PNG, JPG, JPEG, JFIF, WEBP o GIF.');
        this.imageSelected = null;
        this.imagePreview = null;
        return;
      }

      const maxSize = 16 * 1024 * 1024;                                                             // 16 MB
      if (this.imageSelected.size > maxSize) {
        alert('File size exceeds 16 MB');
        this.imageSelected = null;
        this.imagePreview = null;
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
      if(this.outputFormat === '') {
        alert('Please select an output format');
        return;
      }
      this.loading = true;
      const formData = new FormData();
      formData.append('image', this.imageSelected);
      formData.append('outputFormat', this.outputFormat);

      this.dataService.convertImage(formData).subscribe(
        {
          next: (response: Blob) => {
            const url= window.URL.createObjectURL(response);
            console.log(url);
            this.loading = false;
            // file name
            const originalFileName = this.imageSelected?.name;
            const convertedFileName = originalFileName?.substring(0, originalFileName.lastIndexOf(".")) + `.${this.outputFormat}`;
            // download the file
            const a = document.createElement('a');
            a.href = url;
            a.download = convertedFileName;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
            // reset the form
            this.imageSelected = null;
            this.imagePreview = null;
            this.outputFormat = '';
            this.resetInput();
          },
          error: (error) => {
            this.loading = false;
            console.log(error);
          }
        }
      );
    } else {
      alert('Please select an image');
    }
  }

  resetInput() {
    const inputElement = document.getElementById('file-upload') as HTMLInputElement;
    inputElement.value = '';
  }
}


