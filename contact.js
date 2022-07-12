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
    //Mencari data nama contact yang sama dengan nama yang diinput
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
    // console.log(findContact);

    //Pengkodisian apabila data nama contact ditemukan
    if (findContact) {
        console.log(findContact.name);
        //Bila data email contact ada atau terdefinisi
        if (findContact.email) {
            console.log(findContact.email);
        }
        console.log(findContact.mobile);
    } else {    //Apabila data nama contact tidak ditemukan
        console.log(`Data contact dengan nama ${name} tidak ditemukan!`);
        return false;
    }
}

//Fungsi untuk menghapus data contact berdasarkan nama
const deleteContact = (name) => {
    const contacts = loadContact();
    // console.log(contacts);
    
    //Mencari data nama contact yang sama dengan nama yang diinput
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
    //Pengkondisian apabila data contact ditemukan berdasarkan nama yang diinput
    if (findContact) {
        //Membuat array baru dengan filter tanpa object data contact berdasarkan nama yang diinput
        var newContacts = contacts.filter((contact) => contact.name.toLowerCase() !== name.toLowerCase());
        // console.log(newContacts);

        //Menyimpan array data contact yang baru ke file contact.json
        fs.writeFileSync('data/contacts.json', JSON.stringify(newContacts));
        // console.log(contacts);
        console.log(`Data contact dengan nama: ${name} telah dihapus!`);
    } else {    //Apabila data contact berdasarkan nama yang diinput tidak ditemukan
        console.log('Data yang akan dihapus tidak ditemukan!');
        return false;
    }
}

//Fungsi untuk mengubah data contact berdasarkan nama
const updateContact = (findName, name, email, mobile) => {
    const contacts = loadContact();
    //Mencari data nama contact yang sama dengan nama yang dicari
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === findName.toLowerCase());
    // console.log(contacts);

    //Menemukan nilai index object pada data nama yang dicari
    const idxContact = contacts.findIndex((idx => idx.name.toLowerCase() == findName.toLowerCase()));
    // console.log(idxContact);
    
    //Pengkondisian bila data nama contact yang dicari tidak ada
    if (!findContact) {
        console.log(`Data dengan nama "${findName}" tidak ditemukan!`);
        return false;
    }
    
    //Pengkondisian input data nama baru
    if (name) {
        //Pengecekan duplikasi nama baru yang diinput
        const duplicateName = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
        if (duplicateName) {
            console.log(`Data dengan nama "${name}" sudah ada! Coba kembali!`);
            return false;
        }
        //Simpan input data nama baru kedalam object dengan index yang dicari
        contacts[idxContact].name = name;
        // console.log(contacts);
    }

    //Pengkondisian input data email baru
    if (email == '') {
        //Jika input email benilai kosong atau '' maka data email dihapus
        delete contacts[idxContact].email;
        // console.log(contacts);
    }
    //Pengkondisian bila input data email terisi
    else if (email) {
        //Pengkondisian jika data email pada object yang dipilih tidak terdefinisi(undefined)
        if (contacts[idxContact].email == undefined) {
            //Mendefinisikan kembali urutan properti pada object berdasarkan index yang dipilih
            contacts[idxContact] = {name: findContact.name, email: findContact.email, mobile: findContact.mobile};
            // console.log(contacts[idxContact].email);
        }
        //Memvalidasi input data email baru dengan validator
        const vldEmail = validator.isEmail(email);
        //Pengkondisian bila input email invalid
        if (vldEmail == false) {
            console.log('Data email yang dimasukkan invalid!');
            return false
        }
        //Simpan input data email baru kedalam objet dengan index yang dipilih
        contacts[idxContact].email = email;
    }

    //Pengkondisian bila tidak ada input data mobile baru
    if (!mobile) {
        console.log(contacts);
        console.log(`Data Contact dengan nama ${findName} telah diupdate!`);
    } else {
        //Jika data mobile diinput maka data mobile akan dirubah
        //Memvalidasi inputan data mobile baru sesuai format Indonesia
        const vldMobile = validator.isMobilePhone(mobile, 'id-ID');
        if (vldMobile == false) {
            console.log('Data mobile phone yang dimasukkan invalid!');
            return false;
        }
        //Simpan input data mobile baru kedalam object dengan index yang dipilih
        contacts[idxContact].mobile = mobile;
        console.log(contacts);
        console.log(`Data Contact dengan nama ${findName} telah diupdate!`);
    }

    //Menyimpan array contact yang telah diupdate ke file contacts.json
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));

}

//Fungsi untuk menyimpan data contact
const saveContact = (name, email, mobile) => {
    const contact = {name, email, mobile};
    const contacts = loadContact();

    //Variabel untuk menemukan isi name yang sama pada array
    const duplicateName = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
    //Variabel untuk memvalidasi email dengan NPM Validator
    const vldEmail = validator.isEmail(contact.email);
    //Variabel untuk memvalidasi nomor telepon dengan NPM Validator
    const vldMobile = validator.isMobilePhone(contact.mobile, 'id-ID');
    
    //Pengkondisian apabila tidak ada duplikasi isi name pada array
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
    //Apabila ditemukan duplikasi isi name pada array
    else {
        console.log('Data name yang dimasukkan sudah ada!');
        return false;
    };
};

//Export module dari contact.js
module.exports = {listContact, detailContact, deleteContact, updateContact, saveContact};