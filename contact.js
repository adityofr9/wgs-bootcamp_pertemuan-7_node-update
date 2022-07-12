//File System
const fs = require('fs');
//NPM Validator
const validator = require('validator');

// const { rejects } = require('assert');
// const { resolve } = require('path');

//Membuat folder "data" apabila folder tidak ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
}

//Membuat file "contacts.json" apabila file tidak ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8');
}

const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf8');
    const contacts = JSON.parse(file);
    return contacts;
}

//Fungsi untuk menampilkan List Contact
const listContact = () => {
    const contacts = loadContact();
    console.log('Contact List: ');
    contacts.forEach((contact, i) => {
        console.log(`${i+1}. ${contact.name} - ${contact.mobile}`);
    });
}

//Fungsi untuk menampilkan detail data contact berdasarkan nama
const detailContact = (name) => {
    const contacts = loadContact();
    const findContact = contacts.find((contact) => contact.name === name);
    // console.log(findContact);
    //Pengkodisian apabila data contact ditemukan
    if (findContact) {
        console.log(findContact.name);
        console.log(findContact.email);
        console.log(findContact.mobile);
    } else {    //Apabila data contact tidak ditemukan
        console.log('Data tidak ditemukan!');
        return false;
    }
}

//Fungsi untuk menghapus data contact berdasarkan nama
const deleteContact = (name) => {
    const contacts = loadContact();
    // console.log(contacts);
    //Mencari data contact berdasarkan nama
    const findContact = contacts.find((contact) => contact.name === name);
    //Pengkondisian apabila data contact ditemukan berdasarkan nama
    if (findContact) {
        //Membuat array baru dengan filter tanpa data contact yang berdasarkan nama
        var newContacts = contacts.filter((contact) => contact.name !== name);
        // console.log(newContacts);
        //Menyimpan array data contact yang baru ke file contact.json
        fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts));
        // console.log(contacts);
        console.log(`Data contact dengan nama: ${name} telah dihapus!`);
    } else {    //Apabila data contact tidak ditemukan
        console.log('Data yang akan dihapus tidak ditemukan!');
        return false;
    }
}

//Fungsi untuk menyimpan data contact
const saveContact = (name, email, mobile) => {
    const contact = {name, email, mobile};
    // const file = fs.readFileSync('data/contacts.json', 'utf8');
    // const contacts = JSON.parse(file);
    //2 baris code diatas dijadikan kedalam fungsi loadContact()
    const contacts = loadContact();

    //Variabel untuk menemukan isi name yang sama pada array
    const duplicateName = contacts.find((contact) => contact.name === name);
    //Variabel untuk memvalidasi email dengan NPM Validator
    const vldEmail = validator.isEmail(contact.email);
    //Variabel untuk memvalidasi nomor telepon dengan NPM Validator
    const vldMobile = validator.isMobilePhone(contact.mobile, 'id-ID');
    
    //Pengkondisian apabila duplikat isi name pada array tidak ada
    if (!duplicateName) {
        //Pengkondisian apabila input variabel vldEmail sudah valid
        if (vldEmail == true) {
            //Pengkondisian apabila input variabel vldMobile sudah valid
            if (vldMobile == true) {
                contacts.push(contact);
                fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
                console.log('Terima kasih sudah memasukkan data!');
            }
            //Apabila input variabel vldMobile masih invalid 
            else {
                console.log('Data mobile phone yang dimasukkan invalid! Harap check kembali sesuai format mobile phone Indonesia');
                return false;
            };
        }
        //Apabila input variabel vldEmail masih invalid 
        else {
            console.log('Data email yang dimasukkan invalid!');
            return false;
        };
    }
    //Apabila duplikat isi name pada array ditemukan
    else {
        console.log('Data name yang dimasukkan sudah ada!');
        return false;
    };
};

//Export module dari contact.js
module.exports = {listContact, detailContact, deleteContact, deleteContact2, saveContact};