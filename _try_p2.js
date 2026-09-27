const fs=require('fs'),vm=require('vm');try{vm.runInContext(fs.readFileSync('data_bulk_p2.js','utf8'),vm.createContext({}));console.log('OK')}catch(e){console.log(e.stack.split('
').slice(0,6).join('
'))}
