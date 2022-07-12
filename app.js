//NPM yargs
const yargs = require("yargs");
//Import semua fungsi dari contact.js
const contacts = require('./contact.js');

//console.log(yargs.argv);

yargs.command({
    command: 'add',
    describe: 'add new contact',        //Untuk menjelaskan describe untuk apa fungsi ini pada saat command console "node app add --help"
    builder:{
        name: {
            describe: 'Contact Name',
            demandOption: true,         //Sifat data yang wajib diinput, bila false data dapat diabaikan
            type: 'string',
        },
        email: {
            describe: 'Contact email',
            demandOption: false,
            type: 'string',
        },
        mobile: {
            describe: 'contact mobile phone number',
            demandOption: true,
            type: 'string',
        },
    },

    handler(argv){
        contacts.saveContact(argv.name,argv.email,argv.mobile);
    },
});

//Menampilkan List Contact
yargs.command({
    command: 'list',
    describe: 'see contact list',
    handler(argv){
        contacts.listContact();
    },
});

//Menampilkan Detail Contact berdasarkan nama
yargs.command({
    command: 'detail',
    describe: 'see detail contact base on name',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv){
        contacts.detailContact(argv.name);
    },
    
});

//Menghapus data Contact berdasarkan nama
yargs.command({
    command: 'delete',
    describe: 'delete contact base on name',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv){
        contacts.deleteContact(argv.name);
    },
    
});

//Mengubah data Contact berdasarkan nama
yargs.command({
    command: 'update',
    describe: 'update contact base on name',
    builder:{
        name:{
            describe: 'Contact Name',
            demandOption: true,
            type: 'string',
        },
    },
    handler(argv){
        contacts.updateContact(argv.name);
    },
    
});

yargs.parse();