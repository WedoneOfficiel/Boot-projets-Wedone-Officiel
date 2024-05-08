document.getElementById('generate-qr').addEventListener('click', function() {
    var url = document.getElementById('url-input').value;
    var qrContainer = document.getElementById('qr-container');
    qrContainer.innerHTML = '';  // Clear previous QR Code
    var qrCode = new QRCode(qrContainer, {
        text: url,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // Ajouter un bouton de téléchargement si ce n'est pas déjà fait
    if (!qrContainer.querySelector('button')) {
        var downloadButton = document.createElement('button');
        downloadButton.textContent = 'Télécharger le QR Code';
        downloadButton.addEventListener('click', function() {
            var canvas = qrContainer.querySelector('canvas');
            var image = canvas.toDataURL('image/png').replace("image/png", "image/octet-stream");
            var link = document.createElement('a');
            link.download = 'wedone-qrcode.png';
            link.href = image;
            link.click();
        });
        qrContainer.appendChild(downloadButton);
    }
});
