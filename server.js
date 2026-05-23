const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Porta do Render/Railway
const PORT = process.env.PORT || 3000;

// Pasta uploads
const uploadPath = path.join(__dirname, "uploads");

// Cria a pasta automaticamente
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuração do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const fileName = Date.now() + ".jpg";
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Permitir arquivos estáticos
app.use(express.static(__dirname));

// Página principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Upload da foto
app.post("/upload", upload.single("foto"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Nenhuma foto enviada"
    });
  }

  console.log("Foto salva:", req.file.filename);

  res.json({
    success: true,
    file: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// Acesso às fotos
app.use("/uploads", express.static(uploadPath));

// Inicia servidor
app.listen(PORT, "0.0.0.0", () => {

  console.log("Servidor rodando");
  console.log(`Porta: ${PORT}`);

});