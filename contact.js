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
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
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
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
    //Pengkondisian apabila data contact ditemukan berdasarkan nama
    if (findContact) {
        //Membuat array baru dengan filter tanpa data contact yang berdasarkan nama
        var newContacts = contacts.filter((contact) => contact.name.toLowerCase() !== name.toLowerCase());
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

//Fungsi untuk mengubah data contact berdasarkan nama
const updateContact = (findName, name, email, mobile) => {
    const contacts = loadContact();
    const findContact = contacts.find((contact) => contact.name.toLowerCase() === findName.toLowerCase());
    // console.log(contacts);
    //Menemukan nilai index array pada data yang dicari
    const idxContact = contacts.findIndex((idx => idx.name.toLowerCase() == findName.toLowerCase()));
    // console.log(idxContact);
    
    //Mengecek apakah data yang dicari ditemukan atau tidak
    if (!findContact) {
        console.log(`Data dengan nama "${findName}" tidak ditemukan!`);
        return false;
    }

    //Pengkondisian input data nama baru
    if (name) {
        //Mengecek duplikasi input nama
        const duplicateName = contacts.find((contact) => contact.name === name);
        if (duplicateName) {
            console.log(`Data dengan nama "${name}" sudah ada! Coba kembali!`);
            return false;
        }
        //Simpan input data nama baru kedalam array dengan index yang dicari
        contacts[idxContact].name = name;
        // console.log(contacts);
    }

    //Mengecek apakah data email diinput atau tidak
    if (!email) {
        //Jika tidak diinput maka data email dihapus
        // delete contacts[idxContact].email;
        // console.log(contacts);
    } else {
        //Jika data email diinput maka data email akan dirubah
        //Mengecek validasi inputan email
        const vldEmail = validator.isEmail(email);
        if (vldEmail == false) {
            console.log('Data email yang dimasukkan invalid!');
            return false;
        }
        //Simpan input data email baru kedalam array dengan index yang dicari
        contacts[idxContact].email = email;
        // console.log(contacts);
    }

    //Mengecek apakah input data mobile diinput atau tidak
    if (!mobile) {
        console.log(contacts);
        console.log(`Data Contact dengan nama ${findName} telah diupdate!`);
    } else {
        //Jika data mobile diinput maka data mobile akan dirubah
        //Mengecek validasi inputan mobile sesuai format Indonesia
        const vldMobile = validator.isMobilePhone(mobile, 'id-ID');
        if (vldMobile == false) {
            console.log('Data mobile phone yang dimasukkan invalid!');
            return false;
        }
        //Simpan input data mobile baru kedalam array dengan index yang dicari
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
module.exports = {listContact, detailContact, deleteContact, updateContact, saveContact};