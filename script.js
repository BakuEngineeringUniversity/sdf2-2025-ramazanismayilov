// Common utility functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main');
    
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
  }
  
  function showToast(message) {
    // Create toast element if it doesn't exist
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    
    // Set message and show toast
    toast.textContent = message;
    toast.classList.add('show');
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
  
  function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    }).catch(err => {
      showToast('Failed to copy: ' + err);
    });
  }
  
  function clearText(elementId) {
    const element = document.getElementById(elementId);
    element.value = '';
  }
  
  // Tool navigation
  function showTool(toolId) {
    // Hide all tool contents
    const toolContents = document.querySelectorAll('.tool-content');
    toolContents.forEach(content => {
      content.classList.remove('active');
    });
    
    // Show selected tool content
    const selectedTool = document.getElementById(toolId);
    if (selectedTool) {
      selectedTool.classList.add('active');
    }
    
    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Find and highlight the menu item that corresponds to this tool
    menuItems.forEach(item => {
      if (item.getAttribute('onclick') && item.getAttribute('onclick').includes(toolId)) {
        item.classList.add('active');
      }
    });
  }
  
  function showAllTools() {
    showTool('home-screen');
  }
  
  // Search functionality
  document.getElementById('search-input').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
      const title = card.querySelector('.title').textContent.toLowerCase();
      const desc = card.querySelector('.desc').textContent.toLowerCase();
      
      if (title.includes(searchTerm) || desc.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
  
  // ============= Base64 Image Encoder / Decoder =============
  let currentBase64ImageMode = 'encode';
  
  function setBase64ImageMode(mode) {
    currentBase64ImageMode = mode;
    
    // Update UI based on mode
    const modeButtons = document.querySelectorAll('#base64-image .mode-btn');
    modeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      }
    });
    
    // Toggle sections visibility
    if (mode === 'encode') {
      document.getElementById('image-input-section').style.display = 'block';
      document.getElementById('base64-input-section').style.display = 'none';
      document.getElementById('base64-output-section').style.display = 'block';
      document.getElementById('image-output-section').style.display = 'none';
    } else {
      document.getElementById('image-input-section').style.display = 'none';
      document.getElementById('base64-input-section').style.display = 'block';
      document.getElementById('base64-output-section').style.display = 'none';
      document.getElementById('image-output-section').style.display = 'block';
    }
  }
  
  function handleImageUpload() {
    const fileInput = document.getElementById('image-file');
    const preview = document.getElementById('image-preview');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        preview.src = e.target.result;
        
        // If in encode mode, encode the image to base64
        if (currentBase64ImageMode === 'encode') {
          const base64Output = document.getElementById('base64-output');
          // Extract the base64 part only (remove data:image/xxx;base64,)
          const base64Data = e.target.result.split(',')[1];
          base64Output.value = base64Data;
        }
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  function decodeBase64Image() {
    const base64Input = document.getElementById('base64-input').value.trim();
    const decodedImage = document.getElementById('decoded-image');
    
    if (base64Input) {
      try {
        // Check if the input already has the data URL prefix
        let dataUrl;
        if (base64Input.startsWith('data:image')) {
          dataUrl = base64Input;
        } else {
          // Try to determine image type or default to PNG
          dataUrl = 'data:image/png;base64,' + base64Input;
        }
        
        decodedImage.src = dataUrl;
        decodedImage.style.display = 'block';
      } catch (error) {
        showToast('Invalid Base64 image data');
      }
    } else {
      showToast('Please enter Base64 data to decode');
    }
  }
  
  function downloadDecodedImage() {
    const decodedImage = document.getElementById('decoded-image');
    if (decodedImage.src) {
      const link = document.createElement('a');
      link.href = decodedImage.src;
      link.download = 'decoded_image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showToast('No image to download');
    }
  }
  
  // ============= Base64 Text Encoder / Decoder =============
  let currentBase64TextMode = 'encode';
  
  function setBase64TextMode(mode) {
    currentBase64TextMode = mode;
    
    // Update UI based on mode
    const modeButtons = document.querySelectorAll('#base64-text .mode-btn');
    modeButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-mode') === mode) {
        btn.classList.add('active');
      }
    });
    
    // Update labels
    if (mode === 'encode') {
      document.getElementById('text-input-label').textContent = 'Text Input';
      document.getElementById('text-output-label').textContent = 'Base64 Output';
    } else {
      document.getElementById('text-input-label').textContent = 'Base64 Input';
      document.getElementById('text-output-label').textContent = 'Decoded Text';
    }
  }
  
  function processBase64Text() {
    const input = document.getElementById('text-input').value;
    const output = document.getElementById('text-output');
    
    if (input.trim() === '') {
      showToast('Please enter text to process');
      return;
    }
    
    try {
      if (currentBase64TextMode === 'encode') {
        // Encode text to Base64
        output.value = btoa(input);
      } else {
        // Decode Base64 to text
        output.value = atob(input);
      }
    } catch (error) {
      showToast('Error processing text: ' + error.message);
    }
  }
  
  // ============= Certificate Decoder =============
  function handleCertFileUpload() {
    const fileInput = document.getElementById('cert-file');
    const certInput = document.getElementById('cert-input');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        certInput.value = e.target.result;
      };
      
      reader.readAsText(file);
    }
  }
  
  function decodeCertificate() {
    const certInput = document.getElementById('cert-input').value.trim();
    const certDetails = document.getElementById('cert-details');
    
    if (!certInput) {
      showToast('Please enter a certificate to decode');
      return;
    }
    
    try {
      // Simple PEM certificate parsing
      // This is a basic implementation - a real one would use a proper ASN.1 parser
      const parsedCert = parsePEMCertificate(certInput);
      
      if (parsedCert) {
        certDetails.innerHTML = `
          <div class="cert-section">
            <h3>Certificate Information</h3>
            <div class="cert-detail"><strong>Subject:</strong> ${parsedCert.subject || 'Not available'}</div>
            <div class="cert-detail"><strong>Issuer:</strong> ${parsedCert.issuer || 'Not available'}</div>
            <div class="cert-detail"><strong>Valid From:</strong> ${parsedCert.validFrom || 'Not available'}</div>
            <div class="cert-detail"><strong>Valid To:</strong> ${parsedCert.validTo || 'Not available'}</div>
            <div class="cert-detail"><strong>Serial Number:</strong> ${parsedCert.serialNumber || 'Not available'}</div>
            <div class="cert-detail"><strong>Version:</strong> ${parsedCert.version || 'Not available'}</div>
            <div class="cert-detail"><strong>Algorithm:</strong> ${parsedCert.algorithm || 'Not available'}</div>
          </div>
        `;
      } else {
        certDetails.innerHTML = '<p>Unable to parse certificate. Make sure it\'s in valid PEM format.</p>';
      }
    } catch (error) {
      certDetails.innerHTML = `<p>Error decoding certificate: ${error.message}</p>`;
    }
  }
  
  function parsePEMCertificate(pemData) {
    // This is a simplified parser for demonstration
    // In a real implementation, you would use a proper ASN.1/X.509 parser
    
    // Check if it's a PEM certificate
    if (!pemData.includes('-----BEGIN CERTIFICATE-----')) {
      throw new Error('Not a valid PEM certificate');
    }
    
    // Extract basic information using regex patterns
    // Note: This is very basic and won't work for all certificates
    const subjectMatch = pemData.match(/Subject: (.+?)(?=\r\n|\n|\r|$)/i);
    const issuerMatch = pemData.match(/Issuer: (.+?)(?=\r\n|\n|\r|$)/i);
    const validFromMatch = pemData.match(/Not Before: (.+?)(?=\r\n|\n|\r|$)/i);
    const validToMatch = pemData.match(/Not After : (.+?)(?=\r\n|\n|\r|$)/i);
    const serialMatch = pemData.match(/Serial Number: (.+?)(?=\r\n|\n|\r|$)/i);
    const versionMatch = pemData.match(/Version: (.+?)(?=\r\n|\n|\r|$)/i);
    const algorithmMatch = pemData.match(/Signature Algorithm: (.+?)(?=\r\n|\n|\r|$)/i);
    
    return {
      subject: subjectMatch ? subjectMatch[1] : 'Could not extract',
      issuer: issuerMatch ? issuerMatch[1] : 'Could not extract',
      validFrom: validFromMatch ? validFromMatch[1] : 'Could not extract',
      validTo: validToMatch ? validToMatch[1] : 'Could not extract',
      serialNumber: serialMatch ? serialMatch[1] : 'Could not extract',
      version: versionMatch ? versionMatch[1] : 'Could not extract',
      algorithm: algorithmMatch ? algorithmMatch[1] : 'Could not extract'
    };
  }
  
  // ============= Color Blindness Simulator =============
  let originalImage = null;
  
  function handleColorBlindnessImageUpload() {
    const fileInput = document.getElementById('color-image-file');
    const preview = document.getElementById('color-image-preview');
    const file = fileInput.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        preview.src = e.target.result;
        
        // Save the original image for processing
        originalImage = new Image();
        originalImage.src = e.target.result;
        
        // Also show in the output preview initially
        document.getElementById('color-blind-preview').src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    }
  }
  
  function simulateColorBlindness(type) {
    if (!originalImage) {
      showToast('Please upload an image first');
      return;
    }
    
    // Get all type buttons and remove active class
    const typeButtons = document.querySelectorAll('.color-type-btn');
    typeButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to the selected button
    event.target.classList.add('active');
    
    // Create a canvas to process the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match the image
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Draw the original image onto the canvas
    ctx.drawImage(originalImage, 0, 0);
    
    // Apply color blindness simulation if not "normal"
    if (type !== 'normal') {
      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Process each pixel
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Apply simulation based on type
        let newColor;
        switch (type) {
          case 'protanopia': // Red-blind
            newColor = simulateProtanopia(r, g, b);
            break;
          case 'deuteranopia': // Green-blind
            newColor = simulateDeuteranopia(r, g, b);
            break;
          case 'tritanopia': // Blue-blind
            newColor = simulateTritanopia(r, g, b);
            break;
          case 'achromatopsia': // Monochrome
            newColor = simulateAchromatopsia(r, g, b);
            break;
        }
        
        // Apply the new color
        data[i] = newColor.r;
        data[i + 1] = newColor.g;
        data[i + 2] = newColor.b;
      }
      
      // Put the processed image data back on the canvas
      ctx.putImageData(imageData, 0, 0);
    }
    
    // Show the processed image
    document.getElementById('color-blind-preview').src = canvas.toDataURL('image/png');
  }
  
  // Color blindness simulation functions
  function simulateProtanopia(r, g, b) {
    // Simplified red-blindness simulation
    return {
      r: 0.56667 * r + 0.43333 * g,
      g: 0.55833 * r + 0.44167 * g,
      b: 0.24167 * r + 0.75833 * b
    };
  }
  
  function simulateDeuteranopia(r, g, b) {
    // Simplified green-blindness simulation
    return {
      r: 0.625 * r + 0.375 * g,
      g: 0.7 * r + 0.3 * g,
      b: 0.3 * r + 0.7 * b
    };
  }
  
  function simulateTritanopia(r, g, b) {
    // Simplified blue-blindness simulation
    return {
      r: 0.95 * r + 0.05 * g,
      g: 0.2 * r + 0.8 * g,
      b: 0.4 * g + 0.6 * b
    };
  }
  
  function simulateAchromatopsia(r, g, b) {
    // Monochrome simulation (grayscale)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    return {
      r: gray,
      g: gray,
      b: gray
    };
  }
  
  function downloadSimulatedImage() {
    const simulatedImage = document.getElementById('color-blind-preview');
    if (simulatedImage.src) {
      const link = document.createElement('a');
      link.href = simulatedImage.src;
      link.download = 'color_blindness_simulation.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      showToast('No image to download');
    }
  }
  
  // ============= Cron Expression Parser =============
  function parseCronExpression() {
    const cronInput = document.getElementById('cron-input').value.trim();
    
    if (!cronInput) {
      showToast('Please enter a cron expression');
      return;
    }
    
    try {
      // Parse the cron expression
      const parts = cronInput.split(' ');
      
      if (parts.length < 5) {
        throw new Error('Invalid cron expression format. Expected at least 5 parts.');
      }
      
      const [minutes, hours, dayOfMonth, month, dayOfWeek] = parts;
      
      // Display field descriptions
      document.getElementById('cron-minutes').textContent = describeCronField(minutes, 'minute', 0, 59);
      document.getElementById('cron-hours').textContent = describeCronField(hours, 'hour', 0, 23);
      document.getElementById('cron-dom').textContent = describeCronField(dayOfMonth, 'day', 1, 31);
      document.getElementById('cron-month').textContent = describeCronField(month, 'month', 1, 12);
      document.getElementById('cron-dow').textContent = describeCronField(dayOfWeek, 'day of week', 0, 6);
      
      // Calculate next execution dates
      const nextDates = calculateNextCronDates(cronInput, 5);
      
      // Display next execution dates
      const datesContainer = document.getElementById('cron-next-dates');
      datesContainer.innerHTML = nextDates.map(date => 
        `<div class="next-date">${date.toLocaleString()}</div>`
      ).join('');
      
    } catch (error) {
      showToast('Error parsing cron expression: ' + error.message);
    }
  }
  
  function describeCronField(field, name, min, max) {
    if (field === '*') {
      return `Every ${name}`;
    }
    
    if (field.includes('/')) {
      const [start, step] = field.split('/');
      const baseDesc = start === '*' ? 'Every' : `Every ${step}th ${name} starting from ${start}`;
      return baseDesc;
    }
    
    if (field.includes('-')) {
      const [start, end] = field.split('-');
      return `Every ${name} from ${start} through ${end}`;
    }
    
    if (field.includes(',')) {
      const values = field.split(',');
      return `At ${name}(s): ${values.join(', ')}`;
    }
    
    // Single value
    return `At ${name}: ${field}`;
  }
  
  function calculateNextCronDates(cronExpression, count) {
    // This is a simplified implementation
    // In a real app, use a library like cron-parser
    
    // Parse the expression
    const [minutesExp, hoursExp, domExp, monthExp, dowExp] = cronExpression.split(' ');
    
    // Start from current date
    const dates = [];
    let currentDate = new Date();
    
    // Add 1 minute to start the search
    currentDate.setMinutes(currentDate.getMinutes() + 1);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);
    
    // Keep checking dates until we find enough matches
    while (dates.length < count) {
      if (matchesCron(currentDate, minutesExp, hoursExp, domExp, monthExp, dowExp)) {
        dates.push(new Date(currentDate));
      }
      
      // Move to next minute
      currentDate.setMinutes(currentDate.getMinutes() + 1);
    }
    
    return dates;
  }
  
  function matchesCron(date, minutes, hours, dom, month, dow) {
    // This is a very simplified implementation for basic patterns
    // A real implementation would handle all cron syntax
    
    // Helper function to check if value matches expression
    function matches(value, expression) {
      if (expression === '*') return true;
      
      if (expression.includes(',')) {
        return expression.split(',').some(e => matches(value, e));
      }
      
      if (expression.includes('-')) {
        const [start, end] = expression.split('-').map(Number);
        return value >= start && value <= end;
      }
      
      if (expression.includes('/')) {
        const [start, step] = expression.split('/');
        const startValue = start === '*' ? 0 : parseInt(start);
        return (value - startValue) % parseInt(step) === 0 && value >= startValue;
      }
      
      return value === parseInt(expression);
    }
    
    // Check if current date components match the cron expression
    return matches(date.getMinutes(), minutes) &&
           matches(date.getHours(), hours) &&
           matches(date.getDate(), dom) &&
           matches(date.getMonth() + 1, month) && // JS months are 0-based, cron is 1-based
           matches(date.getDay(), dow);
  }
  
  // ============= Date Converter =============
  function toggleDateInputFields() {
    const selectedType = document.querySelector('input[name="date-input-type"]:checked').value;
    
    if (selectedType === 'timestamp') {
      document.getElementById('timestamp-input-area').style.display = 'block';
      document.getElementById('datetime-input-area').style.display = 'none';
    } else {
      document.getElementById('timestamp-input-area').style.display = 'none';
      document.getElementById('datetime-input-area').style.display = 'block';
    }
  }
  
  function convertFromTimestamp() {
    const timestampInput = document.getElementById('timestamp-input').value.trim();
    
    if (!timestampInput) {
      showToast('Please enter a timestamp');
      return;
    }
    
    const timestamp = parseInt(timestampInput);
    if (isNaN(timestamp)) {
      showToast('Invalid timestamp');
      return;
    }
    
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    displayDateResults(date, timestamp);
  }
  
  function convertFromDateTime() {
    const datetimeInput = document.getElementById('datetime-input').value;
    
    if (!datetimeInput) {
      showToast('Please select a date and time');
      return;
    }
    
    const date = new Date(datetimeInput);
    const timestamp = Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
    
    displayDateResults(date, timestamp);
  }
  
  function displayDateResults(date, timestamp) {
    // Display Unix timestamp
    document.getElementById('unix-timestamp-result').textContent = timestamp;
    
    // Display local date
    document.getElementById('local-date-result').textContent = date.toLocaleString();
    
    // Display UTC date
    document.getElementById('utc-date-result').textContent = date.toUTCString();
    
    // Display ISO 8601
    document.getElementById('iso-date-result').textContent = date.toISOString();
    
    // Display RFC 2822
    document.getElementById('rfc-date-result').textContent = formatRFC2822(date);
  }
  
  function formatRFC2822(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // Calculate timezone offset
    const offset = date.getTimezoneOffset();
    const offsetHours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0');
    const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
    const offsetSign = offset <= 0 ? '+' : '-';
    
    return `${day}, ${dayOfMonth} ${month} ${year} ${hours}:${minutes}:${seconds} ${offsetSign}${offsetHours}${offsetMinutes}`;
  }
  
  // Initialize the app when the page loads
  document.addEventListener('DOMContentLoaded', function() {
    // Set default tool to show
    showAllTools();
    
    // Set up event listeners for real-time processing where appropriate
    document.getElementById('text-input').addEventListener('input', function() {
      // Auto-process base64 text when typing if not too long
      if (this.value.length < 1000) {
        processBase64Text();
      }
    });
    
    // Set up the timestamp input with current timestamp
    document.getElementById('timestamp-input').value = Math.floor(Date.now() / 1000);
    
    // Set up the datetime input with current date and time
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.getElementById('datetime-input').value = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    // Initial conversion on load
    convertFromTimestamp();
  });