const fs = require('fs');
fetch('http://localhost:5000/api/products')
  .then(async r => { 
      const txt = "Status: " + r.status + "\nBody: " + await r.text();
      fs.writeFileSync('out_test2.txt', txt, 'utf8');
      process.exit(0);
  })
  .catch(e => {
      fs.writeFileSync('out_test2.txt', "Error: " + e.message, 'utf8');
      process.exit(1);
  });
