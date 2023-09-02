import './App.css';
// import {
//   Select, Option, Button,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
// } from "@material-tailwind/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from './component/Form/Form';
import SignIn from './component/SignIn/SignIn';
import SignUp from './component/SignUp/SignUp';
import Admin from './admin';
// import React, { useState, useRef } from 'react';
// import { Modal, Upload } from 'antd';
// import { db, collection, addDoc, getDocs, ref, uploadBytes, storage, getDownloadURL, setDoc, doc } from './config/firebase';
// import Admin from './admin/index';
// import Swal from 'sweetalert2';
// import PrintableComponent from './component/PDFFile';

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });


function App() {


  // const [open, setOpen] = React.useState(false);
  // const handleOpen = () => setOpen(!open);
  // const [selectedGender, setSelectedGender] = useState('');
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');
  // const [previewTitle, setPreviewTitle] = useState('');
  // const [fileList, setFileList] = useState([]);

  // const handleCancel = () => setPreviewOpen(false);

  // const handlePreview = async (file) => {
  //   if (!file.url && !file.preview) {
  //     file.preview = await getBase64(file.originFileObj);
  //   }
  //   setPreviewImage(file.url || file.preview);
  //   setPreviewOpen(true);
  //   setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  // };
  // let latestFile;
  // const handleChange = ({ fileList: newFileList }) => {
  //   if (newFileList.length > 0) {
  //     latestFile = newFileList[newFileList.length - 1];
  //     setFileList([latestFile]);
  //     console.log(latestFile);
  //   } else {
  //     setFileList([]);

  //   }
  // };

  // const handleGenderChange = (event) => {
  //   setSelectedGender(event.target.value);
  // };



  // const handleSubmit = async () => {




  //   let name = document.getElementById("name");
  //   let email = document.getElementById("email");
  //   let fname = document.getElementById("fname");
  //   let city = document.getElementById("city");
  //   let cnic = document.getElementById("cnic");
  //   let phone = document.getElementById("phone");
  //   let dob = document.getElementById("dob");
  //   let qualification = document.getElementById("qualification");
  //   let address = document.getElementById("address");
  //   let gender = document.getElementById("gender");
  //   let errorMsg = ""
  //   if (!name.value || !email.value || !fname.value || !city.value || !cnic.value || !phone.value || !dob.value || !qualification.value || !address.value || !gender.value) {
  //     if (!name.value) errorMsg += "- Name\n";
  //     if (!email.value) errorMsg += "- Email\n";
  //     if (!fname.value) errorMsg += "- Father Name\n";
  //     if (!city.value) errorMsg += "- City\n";
  //     if (!cnic.value) errorMsg += "- CNIC\n";
  //     if (!phone.value) errorMsg += "- Phone\n";
  //     if (!dob.value) errorMsg += "- Date of Birth\n";
  //     if (!qualification.value) errorMsg += "- Qualification\n";
  //     if (!address.value) errorMsg += "- Address\n";
  //     if (!gender.value) errorMsg += "- Gender\n";

  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Following Fields are Required.',
  //       text: `${errorMsg}`,
  //     })
  //     return;
  //   }

  //   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
  //   const phonePattern = /^\d{11}$/;
  //   if (!fileList[0]) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Image Required.',
  //     })
  //   }

  //   // Validate email, CNIC, and phone number
  //   if (!emailPattern.test(email.value)) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Invalid Email Address.'
  //     })
  //     return;
  //   }
  //   if (!cnicPattern.test(cnic.value)) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: "Invalid CNIC number. Format should be: 12345-1234567-1"
  //     })
  //     return;
  //   }
  //   if (!phonePattern.test(phone.value)) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: "Invalid phone number. Phone number should be 11 digits long."
  //     })
  //     return;
  //   }


  //   let random;
  //   while (true) {
  //     random = Math.floor(Math.random() * 9000 + 1000);;

  //     // Check if the generated roll number exists in the database
  //     const rollNumberSnapshot = await getDocs(collection(db, "rollnumber"));
  //     let rollNumberExists = false;

  //     rollNumberSnapshot.forEach((doc) => {
  //       if (doc.data().roll === random) {
  //         rollNumberExists = true;
  //       }
  //     });

  //     if (!rollNumberExists) {
  //       break; // Break the loop if the roll number is unique
  //     }
  //   }

  //   try {
  //     const docRef = await addDoc(collection(db, "rollnumber"), {
  //       roll: random,
  //     });
  //     console.log("Document written with ID: ", docRef.id);

  //     // Rest of your code to add user data to Firestore
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }


  //   console.log(random);




  //   try {
  //     const docRef = await addDoc(collection(db, "Students"), {
  //       name: name.value,
  //       email: email.value,
  //       fname: fname.value,
  //       city: city.value,
  //       cnic: cnic.value,
  //       phone: phone.value,
  //       DateOfBirth: dob.value,
  //       qualification: qualification.value,
  //       address: address.value,
  //       gender: gender.value,
  //       status: "painding",
  //       rollNumber: random,
  //       pic: ''
  //     });

  //     const storageRef = ref(storage, `images/${docRef.id}`);
  //     uploadBytes(storageRef, fileList[0].originFileObj).then((snapshot) => {
  //       console.log('Uploaded a blob or file!');

  //     }).then(() => {



  //       getDownloadURL(ref(storage, `images/${docRef.id}`))
  //         .then(async (url) => {
  //           await setDoc(doc(db, "Students", docRef.id), {
  //             name: name.value,
  //             email: email.value,
  //             fname: fname.value,
  //             city: city.value,
  //             cnic: cnic.value,
  //             phone: phone.value,
  //             DateOfBirth: dob.value,
  //             qualification: qualification.value,
  //             address: address.value,
  //             gender: gender.value,
  //             status: "painding",
  //             rollNumber: random,
  //             pic: url
  //           });
  //           let std={
  //             uid:docRef.id,
  //             pic:url
  //           }
  //           localStorage.setItem("Student",JSON.stringify(std))
  //           alert("data submited")
  //           setOpen(!open)
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //         });
  //     })



  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }



  // };



  return (
    <>


      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Admin />} />
        </Routes>
      </BrowserRouter>

      {/* <Admin /> */}

    </>

  );


}

export default App;
