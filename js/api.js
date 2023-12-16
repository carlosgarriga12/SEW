class DibujoAlmacenado {
  constructor(storageKey) {
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.contexto = this.canvas.getContext('2d');
    this.isDrawing = false;
    this.storageKey = storageKey;

    this.inicializar();
  }

  inicializar() {
    this.cargarDibujo();
    this.addEventListeners();
    this.addResizeListener(); 
  }

  cargarDibujo() {
    const savedDrawing = localStorage.getItem(this.storageKey);
    this.canvas.width = this.canvas.clientWidth; 
    this.canvas.height = this.canvas.clientHeight;
    this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (savedDrawing) {
      const img = new Image();
      img.onload = () => {
        this.contexto.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      };
      img.src = savedDrawing;
      img.alt = "Imagen guardada"
    }
  }

  addEventListeners() {
    this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
    this.canvas.addEventListener('mousemove', this.draw.bind(this));
    this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
    this.canvas.addEventListener('dragover', (e) => e.preventDefault());
    this.canvas.addEventListener('drop', this.handleDrop.bind(this));
  }

  addResizeListener() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    this.cargarDibujo();
  }

  startDrawing(e) {
    this.isDrawing = true;
    this.draw(e);
  }

  draw(e) {
    if (!this.isDrawing) {
      return;
    }
  
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    this.contexto.lineWidth = 5;
    this.contexto.lineCap = 'round';
    this.contexto.strokeStyle = '#000';
  
    this.contexto.lineTo(x, y);
    this.contexto.stroke();
    this.contexto.beginPath();
    this.contexto.moveTo(x, y);
  }

  stopDrawing() {
    this.isDrawing = false;
    localStorage.setItem(this.storageKey, this.canvas.toDataURL());
    this.contexto.beginPath();
  }

  handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = this.handleImageLoad.bind(this, e);
      reader.readAsDataURL(file);
    }
  }

  handleImageLoad(e, event) {
    const img = new Image();
    img.onload = () => {
      this.contexto.drawImage(img, e.clientX - this.canvas.offsetLeft, e.clientY - this.canvas.offsetTop);
      localStorage.setItem(this.storageKey, this.canvas.toDataURL());
    };
    img.src = event.target.result;
    img.alt = "Imagen soltada";
  }

  clearCanvas() {
      this.contexto.clearRect(0, 0, this.canvas.width, this.canvas.height);
      localStorage.removeItem(this.storageKey);
  }
}

const dibujoAlmacenado = new DibujoAlmacenado('dibujo');